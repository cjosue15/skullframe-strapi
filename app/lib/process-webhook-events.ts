import { randomUUID } from 'node:crypto';
import type { ClaimedWebhookEvent, WebhookEventSettlement } from '../interfaces/webhook-event';
import { getOrderForMercadoPagoOrder } from './get-order-by-provider';
import { getMercadoPagoOrderById, getMercadoPagoOrderMismatches } from './mercado-pago';
import { getOrderStateDecision } from './order-state';
import { buildOrderReconciliation } from './update-order';
import { claimWebhookEvent, settleWebhookEvent } from './webhook-event-store';

// One initial attempt and five retries. These delays start after a failed attempt.
const RETRY_DELAYS_MINUTES = [1, 5, 15, 30, 60] as const;
const MAX_ATTEMPTS = RETRY_DELAYS_MINUTES.length + 1;
const BATCH_SIZE = 5;
const START_BUDGET_MS = 45_000;

export interface WebhookBatchResult {
  processed: number;
  discarded: number;
  retried: number;
  failed: number;
}

const retrySettlement = (
  event: ClaimedWebhookEvent,
  processingToken: string,
  reasonCode: string,
): WebhookEventSettlement => ({
  documentId: event.documentId,
  processingToken,
  processingStatus: event.attempts >= MAX_ATTEMPTS ? 'FAILED' : 'PENDING',
  reasonCode,
  ...(event.attempts < MAX_ATTEMPTS ? {
    nextRetryAt: new Date(Date.now() + RETRY_DELAYS_MINUTES[event.attempts - 1] * 60_000).toISOString(),
  } : {}),
});

const processEvent = async (
  event: ClaimedWebhookEvent,
  processingToken: string,
): Promise<WebhookEventSettlement> => {
  const base = { documentId: event.documentId, processingToken };
  if (event.exhausted) return { ...base, processingStatus: 'FAILED', reasonCode: 'attempt_limit_reached' };

  const [providerError, provider] = await getMercadoPagoOrderById(event.providerOrderId);
  if (providerError) return retrySettlement(event, processingToken, 'provider_lookup_failed');

  const [lookupError, order] = await getOrderForMercadoPagoOrder(provider);
  if (lookupError || !order) return {
    ...retrySettlement(event, processingToken, lookupError ? 'local_lookup_failed' : 'local_order_not_found'),
    externalReference: provider.external_reference,
  };

  const metadata = { externalReference: provider.external_reference, orderDocumentId: order.documentId };
  const mismatches = getMercadoPagoOrderMismatches(order, provider);
  if (mismatches.length) return {
    ...base, ...metadata, processingStatus: 'DISCARDED',
    reasonCode: 'order_mismatch', auditDetails: mismatches,
  };

  const decision = getOrderStateDecision(order, provider);
  const orderUpdate = buildOrderReconciliation(order, provider, decision);
  // Unknown or regressive states preserve business status and remain recoverable.
  if (decision.unrecognized) return {
    ...retrySettlement(event, processingToken, 'provider_state_unrecognized'), ...metadata, orderUpdate,
  };
  // PROCESSED means the event was reconciled, including when the payment is still pending.
  return { ...base, ...metadata, processingStatus: 'PROCESSED', orderUpdate };
};

export const processWebhookEvents = async (): Promise<WebhookBatchResult> => {
  const result: WebhookBatchResult = { processed: 0, discarded: 0, retried: 0, failed: 0 };
  const deadline = Date.now() + START_BUDGET_MS;
  for (let index = 0; index < BATCH_SIZE && Date.now() < deadline; index++) {
    const processingToken = randomUUID();
    const [claimError, event] = await claimWebhookEvent(processingToken, MAX_ATTEMPTS);
    if (claimError) throw new Error('event_claim_failed');
    if (!event) break;

    let settlement: WebhookEventSettlement;
    try {
      settlement = await processEvent(event, processingToken);
    } catch {
      settlement = retrySettlement(event, processingToken, 'processing_error');
    }

    let saveError = await settleWebhookEvent(settlement);
    if (saveError?.status === 409) {
      // A changed order requires a fresh provider lookup, never overwriting the new state.
      settlement = retrySettlement(event, processingToken, 'concurrent_update');
      saveError = await settleWebhookEvent(settlement);
    }
    if (saveError) {
      // Leave the lease recoverable when the persistence response is lost or Strapi is unavailable.
      throw new Error('event_settlement_failed');
    }

    if (settlement.processingStatus === 'PROCESSED') result.processed++;
    else if (settlement.processingStatus === 'DISCARDED') result.discarded++;
    else if (settlement.processingStatus === 'FAILED') result.failed++;
    else result.retried++;
  }
  return result;
};

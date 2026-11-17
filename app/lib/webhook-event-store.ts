import type { ClaimedWebhookEvent, WebhookEventSettlement } from '../interfaces/webhook-event';
import { queryV2, StrapiError } from './strapi';

export const claimWebhookEvent = async (
  processingToken: string,
  maxAttempts: number,
): Promise<[StrapiError, null] | [null, ClaimedWebhookEvent | null]> => {
  const [error, result] = await queryV2<{ data: ClaimedWebhookEvent | null }>(
    'webhook-events/claim', 'POST', JSON.stringify({ processingToken, maxAttempts }),
    { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
  );
  if (error) return [error, null];
  if (result?.data === null) return [null, null];
  const event = result?.data;
  if (!event || typeof event.documentId !== 'string' || !event.documentId.trim()
    || typeof event.providerOrderId !== 'string' || !event.providerOrderId.trim()
    || !Number.isSafeInteger(event.attempts) || event.attempts < 1
    || typeof event.exhausted !== 'boolean') {
    return [new StrapiError(502, 'No se pudo reservar el evento.', 'invalid_response'), null];
  }
  return [null, event];
};

export const settleWebhookEvent = async (input: WebhookEventSettlement): Promise<StrapiError | null> => {
  const [error, result] = await queryV2<{ data: { documentId: string; processingStatus: string } }>(
    'webhook-events/settle', 'POST', JSON.stringify(input),
    { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
  );
  if (error) return error;
  if (result?.data?.documentId !== input.documentId || result.data.processingStatus !== input.processingStatus) {
    return new StrapiError(502, 'No se pudo confirmar el procesamiento del evento.', 'invalid_response');
  }
  return null;
};

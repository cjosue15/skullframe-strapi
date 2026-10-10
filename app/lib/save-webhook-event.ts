import { queryV2, StrapiError } from './strapi';

interface ReceivedWebhookEvent {
  providerOrderId: string;
  requestId: string;
  eventAction?: string;
}

interface SavedWebhookEventResponse {
  data?: {
    documentId?: unknown;
    providerOrderId?: unknown;
    requestId?: unknown;
    processingStatus?: unknown;
    attempts?: unknown;
  };
}

/** Persist receipt before acknowledging it; payment fields come from a later provider GET. */
export const saveWebhookEvent = async (
  event: ReceivedWebhookEvent,
): Promise<StrapiError | null> => {
  const [error, result] = await queryV2<SavedWebhookEventResponse>(
    'webhook-events',
    'POST',
    JSON.stringify({ data: {
      providerOrderId: event.providerOrderId,
      requestId: event.requestId,
      ...(event.eventAction ? { eventAction: event.eventAction } : {}),
      processingStatus: 'PENDING',
      attempts: 0,
    } }),
    { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
  );
  if (error) return error;

  const saved = result?.data;
  if (typeof saved?.documentId !== 'string' || !saved.documentId.trim()
    || saved.providerOrderId !== event.providerOrderId
    || saved.requestId !== event.requestId
    || saved.processingStatus !== 'PENDING'
    || saved.attempts !== 0) {
    return new StrapiError(502, 'No se pudo confirmar el registro del evento.', 'invalid_response');
  }

  return null;
};

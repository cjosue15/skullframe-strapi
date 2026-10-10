import { saveWebhookEvent } from '@/app/lib/save-webhook-event';
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from 'mercadopago';
import type { NextRequest } from 'next/server';

// The SDK verifies the signature with Node's crypto module.
export const runtime = 'nodejs';

const respond = (status: number) => new Response(null, { status });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_MERCADOPAGO;

  if (!secret?.trim()) {
    console.error('Mercado Pago webhook unavailable', { reason: 'missing_secret' });
    return respond(503);
  }

  const xSignature = request.headers.get('x-signature')?.trim();
  const xRequestId = request.headers.get('x-request-id')?.trim();

  const dataIds = request.nextUrl.searchParams.getAll('data.id');

  const providerOrderId = dataIds[0]?.trim();
  const dataId = providerOrderId?.toLowerCase();

  if (!xSignature || !xRequestId || !providerOrderId || !dataId || dataIds.length !== 1) {
    return respond(401);
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret,
    });

    const body: unknown = await request.json();

    if (!isRecord(body) || typeof body.type !== 'string' || !isRecord(body.data)) {
      return respond(400);
    }

    const bodyId = body.data.id;
    if (typeof bodyId !== 'string' || bodyId.trim().toLowerCase() !== dataId) {
      return respond(400);
    }

    // The signature binds the query ID, not the JSON body or its payment fields.
    // Other topics do not belong to this checkout integration.
    if (body.type !== 'order') return respond(200);

    // Action is untrusted metadata, never a trigger for approving or discarding a payment.
    const action = typeof body.action === 'string' ? body.action.trim() : '';
    const eventAction = action.length <= 128 && /^order\.[a-z_]+$/.test(action)
      ? action
      : undefined;
    const saveError = await saveWebhookEvent({
      providerOrderId,
      requestId: xRequestId,
      eventAction,
    });
    if (saveError) {
      console.error('Mercado Pago webhook persistence failed', { reason: 'event_save_failed' });
      return respond(503);
    }

    // Receipt is durable. Canonical lookup, matching and reconciliation belong to the processor.
    // Repeated notifications can create several receipts; processing must be idempotent.
    return respond(200);
  } catch (err) {
    if (err instanceof InvalidWebhookSignatureError) {
      console.warn('Mercado Pago webhook rejected', { reason: err.reason });
      return respond(401);
    }
    if (err instanceof SyntaxError) return respond(400);

    console.error('Mercado Pago webhook failed', { reason: 'unexpected_error' });
    return respond(500);
  }
}

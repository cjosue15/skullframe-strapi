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

  const dataId = dataIds[0]?.trim()?.toLowerCase();

  if (!xSignature || !xRequestId || !dataId || dataIds.length !== 1) {
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

    // Reception only: canonical order lookup and persistence are still pending.
    // Never approve a payment using the notification's status or amount.
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

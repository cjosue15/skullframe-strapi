import { timingSafeEqual } from 'node:crypto';
import { processWebhookEvents } from '@/app/lib/process-webhook-events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

async function run(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret?.trim()) {
    console.error('Webhook processor unavailable', { reason: 'missing_cron_secret' });
    return new Response(null, { status: 503 });
  }
  const authorization = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (authorization.length !== expected.length || !timingSafeEqual(authorization, expected)) {
    return new Response(null, { status: 401 });
  }
  if (!process.env.STRAPI_HOST?.trim() || !process.env.STRAPI_TOKEN?.trim()
    || !process.env.APIKEY_MERCADOPAGO?.trim()) {
    console.error('Webhook processor unavailable', { reason: 'missing_configuration' });
    return new Response(null, { status: 503 });
  }
  try {
    return Response.json({ data: await processWebhookEvents() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('Webhook processor failed', { reason: 'processing_failed' });
    return new Response(null, { status: 503 });
  }
}

// GET supports HTTP schedulers; POST also allows an authenticated manual run.
export const GET = run;
export const POST = run;

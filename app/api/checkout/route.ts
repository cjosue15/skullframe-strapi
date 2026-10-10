import { MercadoPagoOrderResponse } from '@/app/interfaces/mercadopago';
import { OrderResponse } from '@/app/interfaces/order';
import { createOrder, getOrderByIdempotencyKey, normalizeOrderEmail } from '@/app/lib/get-or-create-order';
import { createMercadoPagoOrder, recoverMercadoPagoOrder } from '@/app/lib/mercado-pago';
import { strapiErrorResponse } from '@/app/lib/strapi';
import { updateMercadoPagoOrder } from '@/app/lib/update-order';
import { isOrderPayload, orderErrorResponse } from '@/app/lib/utils';
import { getOrderStateDecision } from '@/app/lib/order-state';
import type { CheckoutResult } from '@/app/interfaces/checkout';

const saveCheckoutResponse = async (order: OrderResponse, checkout: MercadoPagoOrderResponse) => {
  if (!checkout?.id || typeof checkout.status !== 'string' || !checkout.status.trim()) {
    return Response.json(
      { error: { code: 'payment_provider_error', message: 'No pudimos obtener los datos del pago. Intenta de nuevo.' } },
      { status: 502 },
    );
  }

  const decision = getOrderStateDecision(order, checkout);
  const error = await updateMercadoPagoOrder(order.documentId, checkout, decision);
  if (error) return strapiErrorResponse(error);

  if (decision.action === 'redirect' && !checkout.checkout_url?.trim()) {
    return Response.json(
      { error: { code: 'payment_provider_error', message: 'No pudimos obtener el enlace de pago. Intenta de nuevo.' } },
      { status: 502 },
    );
  }

  if (decision.unrecognized) {
    return Response.json(
      { error: { code: 'checkout_status_unknown', message: decision.message } },
      { status: 503, headers: { 'Retry-After': '3' } },
    );
  }

  const result: CheckoutResult = {
    action: decision.action,
    orderNumber: order.orderNumber,
    message: decision.message,
    ...(decision.action === 'redirect' ? { url: checkout.checkout_url!.trim() } : {}),
  };
  return Response.json(result);
};

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  if (!isOrderPayload(payload)) {
    return Response.json(
      {
        error: {
          code: 'invalid_request',
          message: 'Revisa el correo, los productos y la clave del intento de compra.',
        },
      },
      { status: 400 },
    );
  }

  const { key, items } = payload;
  const email = normalizeOrderEmail(payload.email);
  const [lookupError, savedOrder] = await getOrderByIdempotencyKey(key, email, items);
  if (lookupError) return orderErrorResponse(lookupError);

  let order = savedOrder;
  if (!order) {
    const [error, createdOrder] = await createOrder(email, key, items);
    if (error) return orderErrorResponse(error);
    if (!createdOrder) return orderErrorResponse(new Error('No se pudo crear la orden.'));
    order = createdOrder;
  }

  // Even saved URLs must be checked: the payment may have completed or expired.
  const [recoveryError, recoveredCheckout] = await recoverMercadoPagoOrder(order);
  if (recoveryError) {
    console.error('Mercado Pago recovery failed', recoveryError);
    return Response.json(
      {
        error: {
          code: 'checkout_recovery_error',
          message: 'No pudimos recuperar tu intento de pago. Intenta de nuevo.',
        },
      },
      { status: 502 },
    );
  }
  if (recoveredCheckout) return saveCheckoutResponse(order, recoveredCheckout);

  // Local evidence of a previous payment is not permission to create another one.
  if (order.providerOrderId || order.checkoutUrl || order.providerStatus
    || order.providerStatusDetail || order.paymentStatus !== 'PENDING'
    || order.orderStatus !== 'PENDING_PAYMENT') {
    return Response.json(
      { error: { code: 'checkout_recovery_error', message: 'No pudimos verificar la orden de pago existente. Conserva este intento y vuelve a consultar.' } },
      { status: 502 },
    );
  }

  // Always use the saved reference, products and prices when retrying this key.
  const [error, checkout] = await createMercadoPagoOrder(order.idempotencyKey, order);
  if (!error) return saveCheckoutResponse(order, checkout);

  console.error('Mercado Pago order failed', error);
  if (
    error.code === 'idempotency_key_already_used' ||
    error.code === 'resource_locked' ||
    error.code === 'network_error' ||
    error.status >= 500
  ) {
    // Another request may have finished, or Mercado Pago accepted the lost request.
    const [latestError, latestOrder] = await getOrderByIdempotencyKey(key, email, items);
    if (latestError) return orderErrorResponse(latestError);
    const [retryError, recovered] = await recoverMercadoPagoOrder(latestOrder ?? order);
    if (!retryError && recovered) return saveCheckoutResponse(latestOrder ?? order, recovered);
    if (retryError) console.error('Mercado Pago recovery failed', retryError);

    // Keep this key: a new key could duplicate a checkout that is not visible yet.
    return Response.json(
      {
        error: {
          code: 'checkout_pending',
          message: 'No pudimos confirmar el enlace de este intento. Vuelve a intentar en unos segundos.',
        },
      },
      { status: 503, headers: { 'Retry-After': '3' } },
    );
  }

  return Response.json(
    { error: { code: 'payment_provider_error', message: 'No se pudo crear la orden de pago. Intenta de nuevo.' } },
    { status: 502 },
  );
}

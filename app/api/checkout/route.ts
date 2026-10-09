import { MercadoPagoOrderResponse } from '@/app/interfaces/mercadopago';
import { OrderResponse } from '@/app/interfaces/order';
import { createOrder, getOrderByIdempotencyKey, normalizeOrderEmail } from '@/app/lib/get-or-create-order';
import { createMercadoPagoOrder, recoverMercadoPagoOrder } from '@/app/lib/mercado-pago';
import { strapiErrorResponse } from '@/app/lib/strapi';
import { updateMercadoPagoOrder } from '@/app/lib/update-order';
import { isOrderPayload, orderErrorResponse } from '@/app/lib/utils';

const saveCheckoutResponse = async (order: OrderResponse, checkout: MercadoPagoOrderResponse) => {
  if (!checkout?.id || !checkout.checkout_url?.trim()) {
    return Response.json(
      { error: { code: 'payment_provider_error', message: 'No pudimos obtener el enlace de pago. Intenta de nuevo.' } },
      { status: 502 },
    );
  }

  const error = await updateMercadoPagoOrder(order.documentId, checkout.id, checkout.checkout_url);
  if (error) return strapiErrorResponse(error);
  return Response.json({ url: checkout.checkout_url });
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

  if (order.checkoutUrl?.trim()) return Response.json({ url: order.checkoutUrl });

  // An incomplete local order can already have a checkout at Mercado Pago.
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
    if (latestOrder?.checkoutUrl?.trim()) return Response.json({ url: latestOrder.checkoutUrl });

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

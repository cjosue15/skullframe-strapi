import { ProductItem } from '@/app/interfaces/store';
import { createMercadoPagoOrder } from '@/app/lib/mercado-pago';
import { getOrCreateOrder } from '@/app/lib/get-or-create-order';
import { updateMercadoPagoOrder } from '@/app/lib/update-order';
import { strapiErrorResponse } from '@/app/lib/strapi';

export async function POST(request: Request) {
  const { email, key, items } = await request.json();

  if (!key || !email || !items) {
    return new Response(
      JSON.stringify({
        error: 'Algunos de los parámetros requeridos no fueron proporcionados.',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const [error, order] = await getOrCreateOrder(email, key, items as ProductItem[]);

  if (error || !order) {
    return new Response(
      JSON.stringify({
        error: error ? error.message : 'No se pudo crear o obtener la orden.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const [orderError, orderResponse] = await createMercadoPagoOrder(order.idempotencyKey, order);

  if (orderError) {
    console.error('Mercado Pago order failed', {
      status: orderError.status,
      code: orderError.code,
      message: orderError.message,
      raw: orderError.raw,
    });

    if (orderError.code === 'idempotency_key_already_used') {
      return Response.json(
        { error: { code: 'duplicate_order', message: 'Esta orden ya fue procesada.' } },
        { status: 409 },
      );
    }

    return Response.json(
      {
        error: {
          code: 'payment_provider_error',
          message: 'No se pudo crear la orden de pago. Intenta de nuevo.',
        },
      },
      { status: 502 },
    );
  }

  const updateError = await updateMercadoPagoOrder(order.documentId);

  if (updateError) return strapiErrorResponse(updateError);

  return new Response(
    JSON.stringify({
      url: orderResponse.checkout_url,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

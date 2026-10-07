import { MercadoPagoError, MercadoPagoErrorBody, MercadoPagoOrderResponse } from '../interfaces/mercadopago';
import { OrderResponse } from '../interfaces/order';
import { centsToSoles } from './money';

export const createMercadoPagoOrder = async (
  key: string,
  order: OrderResponse,
): Promise<[MercadoPagoError, null] | [null, MercadoPagoOrderResponse]> => {
  try {
    const res = await fetch('https://api.mercadopago.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.APIKEY_MERCADOPAGO}`,
        'X-Idempotency-Key': key,
      },
      body: JSON.stringify({
        type: 'online',
        total_amount: centsToSoles(order.totalAmount),
        external_reference: order.orderNumber,
        processing_mode: 'manual',
        items: order.items.map((item) => ({
          external_code: item.productId.toString(),
          title: item.name,
          quantity: item.quantity,
          unit_price: centsToSoles(item.unitPrice),
          picture_url: item.cover,
        })),
        config: {
          online: {
            auto_return: 'approved',
            success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
          },
        },
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as MercadoPagoErrorBody | null;
      const first = body?.errors?.[0];
      return [
        new MercadoPagoError(res.status, first?.message ?? `Mercado Pago respondió ${res.status}`, first?.code, body),
        null,
      ];
    }

    const data = (await res.json()) as MercadoPagoOrderResponse;
    return [null, data];
  } catch (e) {
    return [
      new MercadoPagoError(
        503,
        e instanceof Error ? e.message : 'No se pudo conectar con Mercado Pago',
        'network_error',
      ),
      null,
    ];
  }
};

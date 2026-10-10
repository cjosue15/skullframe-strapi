import type { MercadoPagoOrderDetails } from '../interfaces/mercadopago';
import type { OrderResponse } from '../interfaces/order';
import { queryV2 } from './strapi';

const getOrderByField = async (
  field: 'providerOrderId' | 'orderNumber',
  value: string,
): Promise<[Error, null] | [null, OrderResponse | null]> => {
  const params = new URLSearchParams({
    [`filters[${field}][$eq]`]: value,
    populate: 'items',
    'pagination[pageSize]': '2',
  });
  const [error, result] = await queryV2<{ data: OrderResponse[] }>(
    `orders?${params.toString()}`,
    'GET',
    undefined,
    { cache: 'no-store' },
  );
  if (error) return [error, null];
  if (!Array.isArray(result?.data) || result.data.length > 1) {
    return [new Error('No se pudo identificar una única orden local.'), null];
  }

  const order = result.data[0];
  if (!order) return [null, null];
  if (!order.documentId || order[field] !== value) {
    return [new Error('La respuesta de la orden local no es válida.'), null];
  }
  return [null, order];
};

/** Only accepts identifiers obtained from Mercado Pago's authenticated GET response. */
export const getOrderForMercadoPagoOrder = async (
  provider: Pick<MercadoPagoOrderDetails, 'id' | 'external_reference'>,
): Promise<[Error, null] | [null, OrderResponse | null]> => {
  const [error, order] = await getOrderByField('providerOrderId', provider.id);
  if (error) return [error, null];
  if (order) return [null, order];

  // The webhook can arrive before the checkout saves providerOrderId in Strapi.
  return getOrderByField('orderNumber', provider.external_reference);
};

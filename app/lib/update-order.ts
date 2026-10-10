import { queryV2, StrapiError } from './strapi';
import type { MercadoPagoOrderResponse } from '../interfaces/mercadopago';
import type { OrderStateDecision } from './order-state';

export const updateMercadoPagoOrder = async (
  orderId: string,
  provider: MercadoPagoOrderResponse,
  decision: OrderStateDecision,
): Promise<StrapiError | null> => {
  const [error] = await queryV2(
    `orders/${orderId}`,
    'PUT',
    JSON.stringify({ data: {
      providerOrderId: provider.id,
      providerStatus: provider.status,
      providerStatusDetail: provider.status_detail ?? null,
      ...(provider.checkout_url?.trim() ? { checkoutUrl: provider.checkout_url.trim() } : {}),
      ...(decision.paymentStatus ? { paymentStatus: decision.paymentStatus } : {}),
      ...(decision.orderStatus ? { orderStatus: decision.orderStatus } : {}),
    } }),
  );
  return error;
};

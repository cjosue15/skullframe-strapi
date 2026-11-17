import { queryV2, StrapiError } from './strapi';
import type { MercadoPagoOrderResponse } from '../interfaces/mercadopago';
import type { OrderStateDecision } from './order-state';
import type { OrderResponse } from '../interfaces/order';
import type { OrderReconciliation } from '../interfaces/webhook-event';

export const buildOrderReconciliation = (
  order: OrderResponse,
  provider: MercadoPagoOrderResponse,
  decision: OrderStateDecision,
): OrderReconciliation => ({
  documentId: order.documentId,
  expected: {
    updatedAt: order.updatedAt,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    providerOrderId: order.providerOrderId ?? null,
  },
  data: {
    providerOrderId: provider.id,
    providerStatus: provider.status,
    providerStatusDetail: provider.status_detail ?? null,
    ...(provider.checkout_url?.trim() ? { checkoutUrl: provider.checkout_url.trim() } : {}),
    ...(decision.paymentStatus ? { paymentStatus: decision.paymentStatus } : {}),
    ...(decision.orderStatus ? { orderStatus: decision.orderStatus } : {}),
  },
});

export const updateMercadoPagoOrder = async (
  order: OrderResponse,
  provider: MercadoPagoOrderResponse,
  decision: OrderStateDecision,
): Promise<StrapiError | null> => {
  const [error] = await queryV2(
    `orders/${encodeURIComponent(order.documentId)}/reconcile`,
    'POST',
    JSON.stringify(buildOrderReconciliation(order, provider, decision)),
    { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
  );
  return error;
};

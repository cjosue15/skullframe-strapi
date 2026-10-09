import { queryV2, StrapiError } from './strapi';

export const updateMercadoPagoOrder = async (
  orderId: string,
  providerOrderId: string,
  checkoutUrl: string,
): Promise<StrapiError | null> => {
  const [error] = await queryV2(
    `orders/${orderId}`,
    'PUT',
    JSON.stringify({ data: { providerOrderId, checkoutUrl } }),
  );
  return error;
};

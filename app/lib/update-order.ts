import { queryV2, StrapiError } from './strapi';

export const updateMercadoPagoOrder = async (orderId: string, providerOrderId: string): Promise<StrapiError | null> => {
  const [error] = await queryV2(`orders/${orderId}`, 'PUT', JSON.stringify({ data: { providerOrderId } }));
  return error;
};

import { CreateOrder, OrderResponse } from '../interfaces/order';
import { ProductItem } from '../interfaces/store';
import { getItemsForOrder } from './get-items-for-order';
import { queryV2 } from './strapi';

export const getOrCreateOrder = async (
  email: string,
  key: string,
  items: ProductItem[],
): Promise<[Error | null, null | OrderResponse]> => {
  // TODO: Check if an order already exists for the given key

  // Create a new order if it doesn't exist

  const [error, products] = await getItemsForOrder(items);

  if (error) {
    return [error, null];
  }

  if (!products || products.length === 0) {
    return [new Error('No products found for the given items'), null];
  }

  const subtotalAmount = products.reduce((acc, product) => {
    const item = items.find((i) => i.id === product.id);
    return acc + (item?.quantity || 1) * product.price;
  }, 0);

  const discountAmount = 0;
  const totalAmount = subtotalAmount - discountAmount;

  const newOrder: CreateOrder = {
    orderNumber: crypto.randomUUID(),
    currency: 'PEN',
    idempotencyKey: key,
    email,
    subtotalAmount,
    discountAmount,
    totalAmount,
    orderStatus: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING',
    providerOrderId: '',

    items: products.map((product) => ({
      productId: product.id,
      name: product.title,
      type: product.type,
      slug: product.slug,
      quantity: items.find((item) => item.id === product.id)?.quantity || 1,
      unitPrice: product.price,
      totalPrice: (items.find((item) => item.id === product.id)?.quantity || 1) * product.price,
      cover: process.env.NODE_ENV === 'production' ? product.cover.url : 'https://placehold.net/400x400.png',
    })),
  };

  try {
    const [error, result] = await queryV2<{ data: OrderResponse }>(
      'orders?populate=items',
      'POST',
      JSON.stringify({ data: newOrder }),
    );

    if (error) {
      return [error, null];
    }

    return [null, result.data];
  } catch {
    return [new Error('Error creating order'), null];
  }
};

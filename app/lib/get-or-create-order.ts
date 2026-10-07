import { CreateOrder, OrderItem, OrderResponse } from '../interfaces/order';
import { ProductItem } from '../interfaces/store';
import { getItemsForOrder } from './get-items-for-order';
import { queryV2 } from './strapi';
import { solesToCents } from './money';

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

  try {
    const orderItems: OrderItem[] = products.map((product) => {
      const quantity = items.find((item) => item.id === product.id)?.quantity;

      if (quantity === undefined || !Number.isSafeInteger(quantity) || quantity <= 0) {
        throw new Error('La cantidad de cada producto debe ser un entero positivo.');
      }

      const unitPrice = solesToCents(product.price);
      const totalPrice = unitPrice * quantity;

      if (!Number.isSafeInteger(totalPrice)) {
        throw new Error('El importe del producto supera el máximo permitido.');
      }

      return {
        productId: product.id,
        name: product.title,
        type: product.type,
        slug: product.slug,
        quantity,
        unitPrice,
        totalPrice,
        cover: process.env.NODE_ENV === 'production' ? product.cover.url : 'https://placehold.net/400x400.png',
      };
    });

    const subtotalAmount = orderItems.reduce((total, item) => total + item.totalPrice, 0);

    if (!Number.isSafeInteger(subtotalAmount)) {
      throw new Error('El importe de la orden supera el máximo permitido.');
    }

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
      items: orderItems,
    };

    const [error, result] = await queryV2<{ data: OrderResponse }>(
      'orders?populate=items',
      'POST',
      JSON.stringify({ data: newOrder }),
    );

    if (error) {
      return [error, null];
    }

    return [null, result.data];
  } catch (error) {
    return [error instanceof Error ? error : new Error('Error creating order'), null];
  }
};

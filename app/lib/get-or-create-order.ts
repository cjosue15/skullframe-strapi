import { CreateOrder, OrderItem, OrderResponse } from '../interfaces/order';
import { ProductItem } from '../interfaces/store';
import { getItemsForOrder } from './get-items-for-order';
import { solesToCents } from './money';
import { queryV2 } from './strapi';

export class IdempotencyConflictError extends Error {
  constructor() {
    super('El correo o los productos cambiaron. Inicia un nuevo intento de compra.');
    this.name = 'IdempotencyConflictError';
  }
}

export const normalizeOrderEmail = (email: string): string => email.trim().toLowerCase();

export const getOrderByIdempotencyKey = async (
  key: string,
  email: string,
  items: ProductItem[],
): Promise<[Error | null, null | OrderResponse]> => {
  const params = new URLSearchParams({
    'filters[idempotencyKey][$eq]': key,
    populate: 'items',
    'pagination[pageSize]': '2',
  });
  const [error, result] = await queryV2<{ data: OrderResponse[] }>(
    `orders?${params.toString()}`,
    'GET',
    undefined,
    { cache: 'no-store' },
  );

  if (error) {
    return [error, null];
  }

  if (result.data.length > 1) {
    return [new Error('Hay más de una orden registrada para este intento de compra.'), null];
  }

  const order = result.data[0];
  if (!order) return [null, null];

  const quantities = new Map(items.map((item) => [item.id, item.quantity]));
  const savedIds = new Set(order.items.map((item) => item.productId));
  const sameItems = quantities.size === items.length
    && savedIds.size === order.items.length
    && order.items.length === items.length
    && order.items.every((item) => quantities.get(item.productId) === item.quantity);

  if (normalizeOrderEmail(order.email) !== normalizeOrderEmail(email) || !sameItems) {
    return [new IdempotencyConflictError(), null];
  }

  // Return incomplete orders too: the checkout route resumes the same attempt.
  // TODO: Check payment/order states once webhook reconciliation is implemented.
  return [null, order];
};

export const createOrder = async (
  email: string,
  key: string,
  items: ProductItem[],
): Promise<[Error | null, null | OrderResponse]> => {
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
      email: normalizeOrderEmail(email),
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
      // Another request may have created the order, or the write response was lost.
      const [lookupError, savedOrder] = await getOrderByIdempotencyKey(key, email, items);
      if (lookupError instanceof IdempotencyConflictError) return [lookupError, null];
      if (!lookupError && savedOrder) return [null, savedOrder];
      return [error, null];
    }

    return [null, result.data];
  } catch (error) {
    return [error instanceof Error ? error : new Error('Error creating order'), null];
  }
};

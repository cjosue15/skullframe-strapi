import { OrderPayload } from '../interfaces/store';
import { IdempotencyConflictError } from './get-or-create-order';
import { StrapiError, strapiErrorResponse } from './strapi';

export const isOrderPayload = (value: unknown): value is OrderPayload => {
  if (!value || typeof value !== 'object') return false;
  const { email, key, items } = value as Partial<OrderPayload>;
  if (
    typeof key !== 'string' ||
    !/^[A-Za-z0-9_-]{1,128}$/.test(key) ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !Array.isArray(items) ||
    items.length === 0
  )
    return false;

  return (
    items.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        Number.isSafeInteger(item.id) &&
        item.id > 0 &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0,
    ) && new Set(items.map((item) => item.id)).size === items.length
  );
};

export const orderErrorResponse = (error: Error) => {
  if (error instanceof IdempotencyConflictError) {
    return Response.json({ error: { code: 'idempotency_conflict', message: error.message } }, { status: 409 });
  }
  if (error instanceof StrapiError) return strapiErrorResponse(error);
  return Response.json({ error: { code: 'order_error', message: error.message } }, { status: 500 });
};

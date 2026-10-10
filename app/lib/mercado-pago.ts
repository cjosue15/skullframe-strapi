import {
  MercadoPagoError,
  MercadoPagoErrorBody,
  MercadoPagoOrderDetails,
  MercadoPagoOrderResponse,
  MercadoPagoOrderSearchResponse,
} from '../interfaces/mercadopago';
import { OrderResponse } from '../interfaces/order';
import { centsToSoles, solesToCents } from './money';

const mercadoPagoRequest = async <T>(
  path: string,
  options?: RequestInit,
): Promise<[MercadoPagoError, null] | [null, T]> => {
  try {
    const res = await fetch(`https://api.mercadopago.com/v1/${path}`, {
      ...options,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.APIKEY_MERCADOPAGO}`,
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as MercadoPagoErrorBody | null;
      const first = body?.errors?.[0];
      return [
        new MercadoPagoError(res.status, first?.message ?? `Mercado Pago respondió ${res.status}`, first?.code, body),
        null,
      ];
    }

    return [null, (await res.json()) as T];
  } catch (error) {
    return [
      new MercadoPagoError(
        503,
        error instanceof Error ? error.message : 'No se pudo conectar con Mercado Pago',
        'network_error',
      ),
      null,
    ];
  }
};

export const createMercadoPagoOrder = async (
  key: string,
  order: OrderResponse,
): Promise<[MercadoPagoError, null] | [null, MercadoPagoOrderResponse]> => {
  try {
    return await mercadoPagoRequest<MercadoPagoOrderResponse>('orders', {
      method: 'POST',
      headers: {
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
        payer: {
          email: 'test_user_123134431015783029@testuser.com',
          // email: order.email,
        },
        config: {
          online: {
            auto_return: 'approved',
            success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
          },
        },
      }),
    });
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

/** Reads the canonical order using its original provider ID, not the webhook's lowercase signature ID. */
export const getMercadoPagoOrderById = async (
  providerOrderId: string,
): Promise<[MercadoPagoError, null] | [null, MercadoPagoOrderDetails]> => {
  if (!providerOrderId.trim()) {
    return [new MercadoPagoError(502, 'El ID de la orden de pago no es válido.', 'invalid_order'), null];
  }

  const [error, details] = await mercadoPagoRequest<MercadoPagoOrderDetails>(
    `orders/${encodeURIComponent(providerOrderId)}`,
  );
  if (error) return [error, null];
  if (!details || details.id !== providerOrderId
    || typeof details.status !== 'string' || !details.status.trim()
    || typeof details.external_reference !== 'string' || !details.external_reference.trim()) {
    return [new MercadoPagoError(502, 'Respuesta de la orden de pago inválida.', 'invalid_response'), null];
  }

  return [null, details];
};

/** Shared checks before accepting provider data for a local purchase. */
export const validateMercadoPagoOrder = (
  order: OrderResponse,
  details: MercadoPagoOrderDetails,
): MercadoPagoError | null => {
  let matchingAmount = false;
  try {
    const localAmount = Number(order.totalAmount);
    matchingAmount = /^\d+$/.test(order.totalAmount)
      && Number.isSafeInteger(localAmount)
      && solesToCents(details.total_amount) === localAmount;
  } catch {
    // Invalid amounts must not be accepted as a matching purchase.
  }

  if ((order.providerOrderId && order.providerOrderId !== details.id)
    || details.external_reference !== order.orderNumber
    || !matchingAmount
    || details.currency !== order.currency
    || details.type !== 'online'
    || details.processing_mode !== 'manual') {
    return new MercadoPagoError(502, 'Los datos de la orden de pago no coinciden.', 'invalid_response');
  }
  return null;
};

/** Finds a checkout whose creation response or Strapi update may have been lost. */
export const recoverMercadoPagoOrder = async (
  order: OrderResponse,
): Promise<[MercadoPagoError, null] | [null, MercadoPagoOrderResponse | null]> => {
  let providerOrderId = order.providerOrderId;

  if (!providerOrderId) {
    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt)) {
      return [new MercadoPagoError(502, 'La orden no tiene una fecha de creación válida.', 'invalid_order'), null];
    }

    const params = new URLSearchParams({
      // Allow a small clock difference between Strapi and Mercado Pago.
      begin_date: new Date(createdAt - 5 * 60_000).toISOString(),
      end_date: new Date().toISOString(),
      external_reference: order.orderNumber,
      limit: '2',
    });
    const [error, result] = await mercadoPagoRequest<MercadoPagoOrderSearchResponse>(`orders?${params.toString()}`);
    if (error) return [error, null];
    if (!Array.isArray(result?.data)) {
      return [new MercadoPagoError(502, 'Respuesta de búsqueda inválida.', 'invalid_response'), null];
    }
    if (result.data.length > 1 || Number(result.paging?.total) > 1) {
      return [new MercadoPagoError(502, 'Más de una orden de pago tiene esta referencia.', 'ambiguous_order'), null];
    }

    const foundOrder = result.data[0];
    if (!foundOrder) return [null, null];
    if (foundOrder.external_reference !== order.orderNumber || !foundOrder.id) {
      return [new MercadoPagoError(502, 'La referencia de la orden de pago no coincide.', 'invalid_response'), null];
    }
    providerOrderId = foundOrder.id;
  }

  const [error, details] = await getMercadoPagoOrderById(providerOrderId);
  if (error) return [error, null];
  const validationError = validateMercadoPagoOrder(order, details);
  if (validationError) return [validationError, null];

  let checkoutUrl = details.checkout_url?.trim();
  if (
    !checkoutUrl &&
    (details.status === 'created' || (details.status === 'failed' && details.config?.online?.retries?.allowed === true))
  ) {
    // GET /orders may omit checkout_url. This is the Checkout Pro URL for Peru.
    if (!['PE', 'PER'].includes(details.country_code) || details.currency !== 'PEN') {
      return [
        new MercadoPagoError(502, 'No se pudo recuperar la URL de pago para este país.', 'invalid_response'),
        null,
      ];
    }
    const url = new URL('https://www.mercadopago.com.pe/checkout/v1/redirect');
    url.searchParams.set('order_id', details.id);
    checkoutUrl = url.toString();
  }

  return [
    null,
    {
      id: details.id,
      status: details.status,
      status_detail: details.status_detail,
      checkout_url: checkoutUrl,
      config: details.config,
    },
  ];
};

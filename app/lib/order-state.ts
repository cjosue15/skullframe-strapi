import type { CheckoutAction } from '../interfaces/checkout';
import type { MercadoPagoOrderResponse } from '../interfaces/mercadopago';
import type { OrderResponse, OrderStatus, PaymentStatus } from '../interfaces/order';

export interface OrderStateDecision {
  action: CheckoutAction;
  message: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  unrecognized?: boolean;
}

const rejectionDetails = new Set([
  'bad_filled_card_data', 'invalid_card_token', 'high_risk', 'rejected_by_issuer',
  'required_call_for_authorize', 'max_attempts_exceeded', 'card_disabled',
  'card_insufficient_amount', 'amount_limit_exceeded', 'invalid_installments', 'processing_error',
]);

const unknownState = (): OrderStateDecision => ({
  action: 'blocked',
  unrecognized: true,
  message: 'No pudimos confirmar el estado de este pago. Conservaremos tu intento; consulta nuevamente en unos segundos.',
});

/** Shared by checkout reconciliation and the future webhook. Never marks an order as delivered. */
export function getOrderStateDecision(
  order: OrderResponse,
  provider: MercadoPagoOrderResponse,
): OrderStateDecision {
  const { status } = provider;
  const detail = provider.status_detail ?? '';
  let decision: OrderStateDecision;

  // Unpaid orders can omit status_detail, including in GET /orders/{id}.
  if (status === 'created' && (provider.status_detail == null || detail === 'created')) {
    decision = { action: 'redirect', paymentStatus: 'PENDING', orderStatus: 'PENDING_PAYMENT', message: 'Tu orden está lista para pagar.' };
  } else if (status === 'processed' && detail === 'accredited') {
    decision = { action: 'paid', paymentStatus: 'APPROVED', orderStatus: 'CONFIRMED', message: 'El pago de esta compra ya está confirmado. No necesitas volver a pagar.' };
  } else if (status === 'processed' && detail === 'partially_refunded') {
    decision = { action: 'paid', paymentStatus: 'PARTIALLY_REFUNDED', orderStatus: 'CONFIRMED', message: 'Esta compra ya fue pagada y tiene un reembolso parcial. No necesitas volver a pagar.' };
  } else if ((status === 'processed' || status === 'refunded') && detail === 'refunded') {
    decision = { action: 'blocked', paymentStatus: 'REFUNDED', orderStatus: 'CANCELLED', message: 'El pago de esta compra fue reembolsado. Este intento está cerrado.' };
  } else if (status === 'charged_back' && ['in_process', 'settled', 'reimbursed'].includes(detail)) {
    decision = { action: 'blocked', paymentStatus: 'CHARGED_BACK', orderStatus: 'CANCELLED', message: 'Esta compra tiene un contracargo. Este intento no está disponible para pagar.' };
  } else if (status === 'processing' && ['in_process', 'pending_review_manual', 'waiting_payment'].includes(detail)) {
    decision = { action: 'pending', paymentStatus: 'IN_PROCESS', orderStatus: 'PENDING_PAYMENT', message: 'Tu pago está pendiente de confirmación. Puedes consultar su estado sin iniciar otro cobro.' };
  } else if (status === 'action_required' && ['waiting_payment', 'waiting_transfer', 'waiting_capture', 'waiting_retry'].includes(detail)) {
    decision = {
      action: 'pending',
      paymentStatus: detail === 'waiting_payment' || detail === 'waiting_transfer' ? 'PENDING' : 'IN_PROCESS',
      orderStatus: 'PENDING_PAYMENT',
      message: detail === 'waiting_payment' || detail === 'waiting_transfer'
        ? 'Tu pago está esperando que completes las instrucciones de Mercado Pago. No inicies otro pago mientras esté pendiente.'
        : 'Tu pago está pendiente de procesamiento. Puedes consultar su estado sin iniciar otro cobro.',
    };
  } else if ((status === 'canceled' && detail === 'canceled') || (status === 'expired' && ['expired', 'canceled'].includes(detail))) {
    decision = { action: 'new_attempt', paymentStatus: 'CANCELLED', orderStatus: 'CANCELLED', message: status === 'expired' ? 'Este intento de pago expiró. Puedes iniciar uno nuevo.' : 'Este intento de pago fue cancelado. Puedes iniciar uno nuevo.' };
  } else if (status === 'failed' && rejectionDetails.has(detail)) {
    const retriesAllowed = provider.config?.online?.retries?.allowed;
    if (detail === 'high_risk') {
      decision = { action: 'blocked', paymentStatus: 'REJECTED', orderStatus: 'CANCELLED', message: 'Mercado Pago rechazó este pago por seguridad. Contacta con nosotros para revisar tu compra.' };
    } else if (retriesAllowed === false) {
      decision = { action: 'new_attempt', paymentStatus: 'REJECTED', orderStatus: 'CANCELLED', message: 'El pago fue rechazado. Puedes iniciar un nuevo intento y revisar el medio de pago.' };
    } else if (retriesAllowed === true && detail !== 'max_attempts_exceeded') {
      decision = { action: 'redirect', paymentStatus: 'REJECTED', orderStatus: 'PENDING_PAYMENT', message: 'Puedes reintentar el pago en el mismo checkout de Mercado Pago.' };
    } else {
      decision = unknownState();
    }
  } else {
    decision = unknownState();
  }

  // A stale provider response must not reopen an already paid/refunded/disputed purchase.
  const allowedAfterPayment: Partial<Record<PaymentStatus, PaymentStatus[]>> = {
    APPROVED: ['APPROVED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGED_BACK'],
    PARTIALLY_REFUNDED: ['PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGED_BACK'],
    REFUNDED: ['REFUNDED', 'CHARGED_BACK'],
    CHARGED_BACK: ['CHARGED_BACK'],
  };
  const allowed = allowedAfterPayment[order.paymentStatus];
  if (decision.paymentStatus && (
    (allowed && !allowed.includes(decision.paymentStatus))
    || (['CONFIRMED', 'COMPLETED'].includes(order.orderStatus)
      && ['PENDING', 'IN_PROCESS', 'REJECTED', 'CANCELLED'].includes(decision.paymentStatus))
    || (order.orderStatus === 'CANCELLED' && ['redirect', 'pending'].includes(decision.action))
  )) return unknownState();

  if (decision.orderStatus && order.orderStatus === 'COMPLETED') decision.orderStatus = 'COMPLETED';
  return decision;
}

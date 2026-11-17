import type { OrderStatus, PaymentStatus } from './order';

export interface ClaimedWebhookEvent {
  documentId: string;
  providerOrderId: string;
  attempts: number;
  exhausted: boolean;
}

export interface OrderReconciliation {
  documentId: string;
  expected: {
    updatedAt: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    providerOrderId: string | null;
  };
  data: {
    providerOrderId: string;
    providerStatus: string;
    providerStatusDetail: string | null;
    checkoutUrl?: string;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
  };
}

export interface OrderMismatchDetail {
  field: 'providerOrderId' | 'externalReference' | 'totalAmount' | 'currency' | 'type' | 'processingMode';
  expected: string | null;
  received: string | null;
}

export interface WebhookEventSettlement {
  documentId: string;
  processingToken: string;
  processingStatus: 'PENDING' | 'PROCESSED' | 'FAILED' | 'DISCARDED';
  nextRetryAt?: string;
  reasonCode?: string;
  externalReference?: string;
  orderDocumentId?: string;
  auditDetails?: OrderMismatchDetail[];
  orderUpdate?: OrderReconciliation;
}

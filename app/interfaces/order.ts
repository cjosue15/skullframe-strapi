export type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'CHARGED_BACK';

/** All monetary fields in orders are stored as integer cents. Catalog prices remain in soles. */
export interface CreateOrder {
  orderNumber: string;
  email: string;
  currency: 'USD' | 'PEN';
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  idempotencyKey: string;
  providerOrderId: string;
  items: OrderItem[];
}

/** unitPrice and totalPrice are integer cents. */
export interface OrderItem {
  productId: number;
  name: string;
  type: 'FISICO' | 'DIGITAL';
  slug: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  cover: string;
}

/** Strapi serializes bigint monetary fields in cents as strings. */
export interface OrderResponse {
  documentId: string;
  orderNumber: string;
  email: string;
  currency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
  providerOrderId?: string;
  providerStatus?: string | null;
  providerStatusDetail?: string | null;
  idempotencyKey: string;
  totalAmount: string;
  checkoutUrl?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItemResponse[];
}

/** unitPrice is a string containing integer cents. */
export interface OrderItemResponse {
  name: string;
  quantity: number;
  cover: string;
  unitPrice: string;
  productId: number;
}

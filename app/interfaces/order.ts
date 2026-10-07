/** All monetary fields in orders are stored as integer cents. Catalog prices remain in soles. */
export interface CreateOrder {
  orderNumber: string;
  email: string;
  currency: 'USD' | 'PEN';
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  orderStatus: 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED' | 'CHARGED_BACK';
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
  idempotencyKey: string;
  totalAmount: string;
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

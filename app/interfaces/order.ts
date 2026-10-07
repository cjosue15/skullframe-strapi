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

export interface OrderResponse {
  documentId: string;
  orderNumber: string;
  idempotencyKey: string;
  totalAmount: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  name: string;
  quantity: number;
  cover: string;
  unitPrice: string;
  productId: number;
}

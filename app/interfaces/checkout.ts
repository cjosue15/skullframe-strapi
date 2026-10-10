export type CheckoutAction = 'redirect' | 'pending' | 'paid' | 'new_attempt' | 'blocked';

export interface CheckoutResult {
  action: CheckoutAction;
  orderNumber: string;
  message: string;
  url?: string;
}

export interface CheckoutResponse extends Partial<CheckoutResult> {
  error?: { code?: string; message?: string };
}

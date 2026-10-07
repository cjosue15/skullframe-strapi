export interface MercadoPagoOrderResponse {
  id: string;
  status: string;
  checkout_url: string;
}

export class MercadoPagoError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public raw?: unknown,
  ) {
    super(message);
    this.name = 'MercadoPagoError';
  }
}

export type MercadoPagoErrorBody = {
  errors?: { code?: string; message?: string }[];
};

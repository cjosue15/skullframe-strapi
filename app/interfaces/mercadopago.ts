export interface MercadoPagoOrderResponse {
  id: string;
  status: string;
  status_detail?: string | null;
  checkout_url?: string;
  config?: { online?: { retries?: { allowed?: boolean } } };
}

export interface MercadoPagoOrderDetails {
  id: string;
  status: string;
  status_detail?: string | null;
  type: string;
  processing_mode: string;
  external_reference: string;
  total_amount: string;
  currency: string;
  country_code: string;
  checkout_url?: string;
  config?: { online?: { retries?: { allowed?: boolean } } };
}

export interface MercadoPagoOrderSearchResponse {
  data: MercadoPagoOrderDetails[];
  paging: { total: number | string };
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

const { STRAPI_TOKEN, STRAPI_HOST } = process.env;

export type StrapiErrorBody = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
};

export class StrapiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public raw?: unknown,
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

const isStrapiErrorBody = (value: unknown): value is StrapiErrorBody =>
  typeof value === 'object' && value !== null && typeof (value as StrapiErrorBody).error?.message === 'string';

export const query = <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: string): Promise<T> => {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body,
  }).then((res) => res.json() as Promise<T>);
};

export const queryV2 = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: string,
): Promise<[StrapiError, null] | [null, T]> => {
  try {
    const res = await fetch(`${STRAPI_HOST}/api/${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const rawText = await res.text();
    let parsed: unknown = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {}

    if (!res.ok) {
      const strapiBody = isStrapiErrorBody(parsed) ? parsed : null;

      return [
        new StrapiError(
          res.status,
          strapiBody?.error.message ?? `Strapi respondió ${res.status}`,
          strapiBody?.error.name,
          strapiBody ?? rawText,
        ),
        null,
      ];
    }

    return [null, parsed as T];
  } catch (e) {
    return [
      new StrapiError(503, e instanceof Error ? e.message : 'No se pudo conectar con Strapi', 'network_error'),
      null,
    ];
  }
};

export const strapiErrorResponse = (err: StrapiError) => {
  console.error('Strapi error', {
    status: err.status,
    code: err.code,
    message: err.message,
    raw: err.raw,
  });

  switch (err.status) {
    case 404:
      return Response.json({ error: { code: 'not_found', message: 'No encontramos lo que buscas.' } }, { status: 404 });
    case 400:
    case 422:
      return Response.json(
        { error: { code: 'invalid_request', message: 'Los datos enviados no son válidos.' } },
        { status: 400 },
      );
    default:
      // Incluye 401/403 (tu token es inválido), 5xx y errores de red
      return Response.json(
        { error: { code: 'upstream_error', message: 'Ocurrió un error. Intenta de nuevo.' } },
        { status: 502 },
      );
  }
};

'use client';

import { Arrow, label } from '@/app/components/ui';
import { OrderPayload } from '@/app/interfaces/store';
import { useBagStore } from '@/app/stores/use-bag-store';
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { LoaderCircle } from 'lucide-react';

type CheckoutResponse = {
  url?: string;
  error?: { code?: string; message?: string };
};

function PaymentButton({
  idempotencyKey,
  email,
  handleValidation,
  onError,
}: {
  idempotencyKey: string;
  email: string;
  handleValidation: () => boolean;
  onError: (message: string) => void;
}) {
  const items = useBagStore((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handlePayment = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isSubmitting.current || !handleValidation()) {
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);

    const currentUrl = new URL(window.location.href);
    const payload: OrderPayload = {
      key: currentUrl.searchParams.get('key') ?? idempotencyKey,
      email,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        cover: item.cover,
      })),
    };

    try {
      const submit = async () => {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = (await response.json().catch(() => ({}))) as CheckoutResponse | null;
        return { response, data };
      };

      let result = await submit();
      if (result.response.status === 409 && result.data?.error?.code === 'idempotency_conflict') {
        // Changed purchase data starts a new attempt, including in browser history.
        payload.key = crypto.randomUUID();
        currentUrl.searchParams.set('key', payload.key);
        window.history.replaceState(null, '', currentUrl.toString());
        result = await submit();
      }

      if (!result.response.ok || !result.data?.url) {
        onError(result.data?.error?.message ?? 'No pudimos iniciar el pago. Intenta de nuevo.');
        return;
      }

      window.location.href = result.data.url;
    } catch {
      onError('No pudimos conectar con el servicio de pago. Intenta de nuevo.');
    } finally {
      isSubmitting.current = false;
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={
          label +
          ' mt-8 flex w-full cursor-pointer items-center justify-between bg-aqua px-5 py-4 text-ink transition-colors duration-200 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua disabled:cursor-wait disabled:opacity-60'
        }
        type='submit'
        onClick={handlePayment}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'PREPARANDO PAGO…' : 'CONTINUAR AL PAGO'}
        {isLoading ? (
          <LoaderCircle
            aria-hidden='true'
            className='size-4.5 shrink-0 animate-spin motion-reduce:animate-none'
            strokeWidth={1.5}
          />
        ) : (
          <Arrow />
        )}
      </button>
      <span className='sr-only' role='status'>
        {isLoading ? 'Preparando tu enlace de pago. Espera un momento.' : ''}
      </span>
    </>
  );
}

export default PaymentButton;

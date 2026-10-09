'use client';

import { Arrow, label } from '@/app/components/ui';
import { OrderPayload } from '@/app/interfaces/store';
import { useBagStore } from '@/app/stores/use-bag-store';
import { useRef, useState } from 'react';

type CheckoutResponse = {
  url?: string;
  error?: { code?: string; message?: string };
};

function PaymentButton({
  idempotencyKey,
  email,
  handleValidation,
}: {
  idempotencyKey: string;
  email: string;
  handleValidation: () => boolean;
}) {
  const items = useBagStore((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = useRef(false);

  const handlePayment = async () => {
    if (isSubmitting.current || !handleValidation()) {
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);
    setErrorMessage(null);

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
        const data = (await response.json()) as CheckoutResponse;
        return { response, data };
      };

      let result = await submit();
      if (result.response.status === 409 && result.data.error?.code === 'idempotency_conflict') {
        // Changed purchase data starts a new attempt, including in browser history.
        payload.key = crypto.randomUUID();
        currentUrl.searchParams.set('key', payload.key);
        window.history.replaceState(null, '', currentUrl.toString());
        result = await submit();
      }

      if (!result.response.ok || !result.data.url) {
        setErrorMessage(result.data.error?.message ?? 'No pudimos iniciar el pago. Intenta de nuevo.');
        return;
      }

      window.location.href = result.data.url;
    } catch {
      setErrorMessage('No pudimos conectar con el servicio de pago. Intenta de nuevo.');
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
          ' mt-8 flex w-full cursor-pointer items-center justify-between bg-aqua px-5 py-4 text-ink transition-colors duration-200 hover:bg-paper disabled:cursor-wait disabled:opacity-60'
        }
        type='button'
        onClick={handlePayment}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'PREPARANDO PAGO…' : 'CONTINUAR AL PAGO'} <Arrow />
      </button>
      {errorMessage && <p className='mt-3 text-caption text-red-700' role='alert'>{errorMessage}</p>}
    </>
  );
}

export default PaymentButton;

'use client';

import { Arrow, label } from '@/app/components/ui';
import { OrderPayload } from '@/app/interfaces/store';
import { useBagStore } from '@/app/stores/use-bag-store';
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { CheckoutResponse, CheckoutResult } from '@/app/interfaces/checkout';

const purchaseSignature = (email: string, items: { id: number; quantity: number }[]) => JSON.stringify({
  email: email.trim().toLowerCase(),
  items: items.map(({ id, quantity }) => ({ id, quantity })).sort((a, b) => a.id - b.id),
});

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
  const [savedResult, setSavedResult] = useState<{ signature: string; result: CheckoutResult } | null>(null);
  const signature = purchaseSignature(email, items);
  const checkoutResult = savedResult?.signature === signature ? savedResult.result : null;
  const paymentClosed = checkoutResult?.action === 'paid' || checkoutResult?.action === 'blocked';

  const handlePayment = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isSubmitting.current || paymentClosed || !handleValidation()) {
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

    if (checkoutResult?.action === 'new_attempt') {
      // Starting another purchase requires the buyer to press this button explicitly.
      payload.key = crypto.randomUUID();
      currentUrl.searchParams.set('key', payload.key);
      window.history.replaceState(null, '', currentUrl.toString());
    }
    setSavedResult(null);

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

      if (!result.response.ok) {
        onError(result.data?.error?.message ?? 'No pudimos iniciar el pago. Intenta de nuevo.');
        return;
      }

      if (result.data?.action === 'redirect' && result.data.url) {
        window.location.href = result.data.url;
        return;
      }

      if (result.data?.action && ['pending', 'paid', 'new_attempt', 'blocked'].includes(result.data.action)
        && result.data.message && result.data.orderNumber) {
        setSavedResult({ signature: purchaseSignature(payload.email, payload.items), result: result.data as CheckoutResult });
        return;
      }

      onError('No pudimos confirmar el estado del pago. Intenta de nuevo.');
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
          ' mt-8 flex w-full cursor-pointer items-center justify-between bg-aqua px-5 py-4 text-ink transition-colors duration-200 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua disabled:cursor-default disabled:opacity-60'
        }
        type='submit'
        onClick={handlePayment}
        disabled={isLoading || paymentClosed}
        aria-busy={isLoading}
        aria-describedby={checkoutResult ? 'checkout-payment-status' : undefined}
      >
        {isLoading ? 'CONSULTANDO PAGO…'
          : checkoutResult?.action === 'pending' ? 'CONSULTAR ESTADO'
          : checkoutResult?.action === 'paid' ? 'PAGO CONFIRMADO'
          : checkoutResult?.action === 'new_attempt' ? 'INICIAR NUEVO INTENTO'
          : checkoutResult?.action === 'blocked' ? 'INTENTO CERRADO'
          : 'CONTINUAR AL PAGO'}
        {isLoading ? (
          <LoaderCircle
            aria-hidden='true'
            className='size-4.5 shrink-0 animate-spin motion-reduce:animate-none'
            strokeWidth={1.5}
          />
        ) : !paymentClosed ? (
          <Arrow />
        ) : null}
      </button>
      {checkoutResult && (
        <div
          id='checkout-payment-status'
          role='status'
          aria-live='polite'
          className={`mt-5 border-l-2 pl-4 text-caption leading-copy ${checkoutResult.action === 'paid' ? 'border-aqua text-paper' : 'border-paper/40 text-muted-on-dark'}`}
        >
          <p>{checkoutResult.message}</p>
          <p className='mt-2 break-all text-small text-muted-on-dark'>Orden: {checkoutResult.orderNumber}</p>
        </div>
      )}
      <span className='sr-only' role='status'>
        {isLoading ? 'Consultando tu intento de pago. Espera un momento.' : ''}
      </span>
    </>
  );
}

export default PaymentButton;

'use client';

import { Arrow, label } from '@/app/components/ui';
import { OrderPayload } from '@/app/interfaces/store';
import { useBagStore } from '@/app/stores/use-bag-store';

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

  const handlePayment = async () => {
    if (!handleValidation()) {
      return;
    }

    const payload: OrderPayload = {
      key: idempotencyKey,
      email,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        cover: item.cover,
      })),
    };

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <button
      className={
        label +
        ' mt-8 flex w-full cursor-pointer items-center justify-between bg-aqua px-5 py-4 text-ink transition-colors duration-200 hover:bg-paper'
      }
      type='button'
      onClick={handlePayment}
    >
      CONTINUAR AL PAGO <Arrow />
    </button>
  );
}

export default PaymentButton;

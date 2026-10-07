import type { Metadata } from 'next';
import { CheckoutPage } from '../../components/checkout-page';

export const metadata: Metadata = {
  title: 'Checkout — Skullframe',
  description: 'Completa tu compra digital en Skullframe.',
};

export default async function Checkout({ searchParams }: { searchParams: Promise<{ key: string }> }) {
  const { key } = await searchParams;

  if (!key) {
    throw new Error('Missing key parameter');
  }

  return <CheckoutPage idempotencyKey={key} />;
}

import type { Metadata } from 'next';
import { ShopCatalog } from '../../components/shop-catalog';

export const metadata: Metadata = {
  title: 'Tienda — Skullframe',
  description: 'Drones, componentes y recursos digitales para crear sin límites.',
};

export default function ShopPage() {
  return (
    <main>
      <ShopCatalog />
    </main>
  );
}

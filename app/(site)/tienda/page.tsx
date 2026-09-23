import type { Metadata } from 'next';
import { ShopCatalog } from '../../components/shop-catalog';
import { getStoreInfo } from '@/app/lib/get-store-info';
import { getCategories } from '@/app/lib/get-categories';

export const metadata: Metadata = {
  title: 'Tienda — Skullframe',
  description: 'Drones, componentes y recursos digitales para crear sin límites.',
};

export default async function ShopPage() {
  const products = await getStoreInfo();
  const categories = await getCategories();

  return (
    <main>
      <ShopCatalog products={products} categories={categories} />
    </main>
  );
}

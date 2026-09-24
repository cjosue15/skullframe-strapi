import type { Metadata } from 'next';
import { ShopCatalog } from '../../components/shop-catalog';
import { getStoreInfo } from '@/app/lib/get-store-info';
import { getCategories } from '@/app/lib/get-categories';
import { Pagination } from '@/app/components/pagination';
import { Container } from '@/app/components/container';
import { redirect } from 'next/navigation';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

type ShopSearchParams = { [key: string]: string | string[] | undefined };

function parsePositiveInteger(value: string | string[] | undefined, fallback: number, max = Number.MAX_SAFE_INTEGER) {
  const number = typeof value === 'string' ? Number(value) : Number.NaN;

  return Number.isSafeInteger(number) && number > 0 && number <= max ? number : fallback;
}

function createSearchParams(searchParams: ShopSearchParams) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') params.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
  }

  return params;
}

export const metadata: Metadata = {
  title: 'Tienda — Skullframe',
  description: 'Drones, componentes y recursos digitales para crear sin límites.',
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  const currentSearchParams = await searchParams;
  const { page, pageSize } = currentSearchParams;
  const pageNumber = parsePositiveInteger(page, DEFAULT_PAGE);
  const pageSizeNumber = parsePositiveInteger(pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  if (page !== pageNumber.toString() || pageSize !== pageSizeNumber.toString()) {
    const normalizedSearchParams = createSearchParams(currentSearchParams);
    normalizedSearchParams.set('page', pageNumber.toString());
    normalizedSearchParams.set('pageSize', pageSizeNumber.toString());

    redirect('/tienda?' + normalizedSearchParams.toString());
  }

  const { products, pagination } = await getStoreInfo({ pageSize: pageSizeNumber, page: pageNumber });
  const categories = await getCategories();

  return (
    <main>
      <ShopCatalog products={products} categories={categories} />
      <Container>
        <div className='pb-6'>
          <Pagination pagination={pagination} />
        </div>
      </Container>
    </main>
  );
}

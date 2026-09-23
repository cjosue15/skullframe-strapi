import Link from 'next/link';
import { ProductVisual } from './product-visual';
import { Arrow, display, label } from './ui';
import { Product } from '../interfaces/store';

export function ShopProductCard({ product }: { product: Product }) {
  const typeName = product.type === 'DIGITAL' ? 'DESCARGABLE' : 'FÍSICO';

  return (
    <article className='group min-w-0'>
      <Link className='block overflow-hidden' href={'/tienda/' + product.slug}>
        <ProductVisual product={product} />
      </Link>
      <div className='mt-5 flex items-start justify-between gap-5'>
        <div>
          <p className={label + ' mb-3 text-micro text-muted'}>
            {typeName} · {product.category}
          </p>
          <h2 className={display + ' text-product leading-product'}>{product.title}</h2>
        </div>
        <Link
          className='flex size-8 shrink-0 items-center justify-center rounded-full bg-soft-blue text-ink transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-blue group-hover:text-white'
          href={'/tienda/' + product.slug}
          aria-label={'Ver ' + product.title}
        >
          <Arrow />
        </Link>
      </div>
      <div className='mt-3 flex items-start justify-between gap-4'>
        <p className='max-w-xs text-caption leading-caption text-muted'>{product.shortDescription}</p>
        <strong className='shrink-0 font-body text-small font-semibold'>S/ {product.price}</strong>
      </div>
    </article>
  );
}

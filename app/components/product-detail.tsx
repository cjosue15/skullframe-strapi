import type { Product } from '../data/products';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { ProductGallery } from './product-gallery';
import { Arrow, display, label } from './ui';

export function ProductDetail({ product }: { product: Product }) {
  return (
    <main className='bg-paper pb-20 md:pb-32'>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'INICIO', href: '/' },
            { label: 'TIENDA', href: '/tienda' },
            { label: product.name.toUpperCase() },
          ]}
        />
        <div className='grid border-t border-line pt-8 md:grid-cols-2 md:gap-12 md:pt-12'>
          <ProductGallery product={product} />
          <div className='max-w-120 self-start max-md:mt-10 lg:sticky lg:top-25'>
            <p className={label + ' flex items-center gap-2 text-micro text-muted'}>
              <i className='block size-2 rounded-full bg-blue' /> {product.kind} · {product.category}
            </p>
            <h1 className={display + ' mt-7 text-hero leading-hero'}>{product.name}</h1>
            <p className='mt-7 max-w-lg text-lg leading-copy text-muted'>{product.description}</p>
            <p className={label + ' mt-8 text-small'}>{product.availability}</p>
            <div className='mt-5 flex items-end justify-between border-y border-line py-5'>
              <span className={label + ' text-micro text-muted'}>PRECIO</span>
              <strong className={display + ' text-4xl leading-none'}>{product.price}</strong>
            </div>
            <button
              className={
                label +
                ' mt-7 inline-flex cursor-pointer items-center gap-7 bg-blue px-5 py-4 text-white transition duration-200 hover:-translate-y-0.75 hover:bg-ink'
              }
              type='button'
            >
              AÑADIR A LA BOLSA <Arrow />
            </button>
            <ul className='mt-9 border-t border-line pt-6'>
              {product.details.map((detail, index) => (
                <li className={label + ' flex gap-4 border-b border-line py-3.5'} key={detail}>
                  <span className='text-blue'>0{index + 1}</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </main>
  );
}

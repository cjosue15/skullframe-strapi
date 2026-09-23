import { Product } from '../interfaces/store';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { ProductDescription } from './product-description';
import { ProductGallery } from './product-gallery';
import { Arrow, display, label } from './ui';

export function ProductDetail({ product }: { product: Product }) {
  const isDigitalLabel = product.type === 'DIGITAL' ? 'DIGITAL' : 'FÍSICO';

  return (
    <main className='bg-paper pb-20 md:pb-32'>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'INICIO', href: '/' },
            { label: 'TIENDA', href: '/tienda' },
            { label: product.title.toUpperCase() },
          ]}
        />
        <div className='grid border-t border-line pt-8 md:grid-cols-2 md:gap-12 md:pt-12'>
          <ProductGallery product={product} />
          <div className='max-w-120 self-start max-md:mt-10 lg:sticky lg:top-25'>
            <p className={label + ' flex items-center gap-2 text-micro text-muted'}>
              <i className='block size-2 rounded-full bg-blue' /> {isDigitalLabel} · {product.category}
            </p>
            <h1 className={display + ' mt-7 text-hero leading-hero'}>{product.title}</h1>
            {product.description && <ProductDescription content={product.description} />}

            {/* <p className={label + ' mt-8 text-small'}>{product.availability}</p> */}
            <div className='mt-5 flex items-end justify-between border-y border-line py-5'>
              <span className={label + ' text-micro text-muted'}>PRECIO</span>
              <strong className={display + ' text-4xl leading-none'}>S/ {product.price}</strong>
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
          </div>
        </div>
      </Container>
    </main>
  );
}

import { ShoppingCart } from 'lucide-react';
import { Product } from '../interfaces/store';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { ProductDescription } from './product-description';
import { ProductGallery } from './product-gallery';
import { display, label } from './ui';

export function ProductDetail({ product }: { product: Product }) {
  const hasStock = product.stock > 0;
  const isDigital = product.type === 'DIGITAL';
  const isDigitalLabel = isDigital ? 'DIGITAL' : 'FÍSICO';
  const stockLabel = isDigital
    ? 'DESCARGA INMEDIATA'
    : hasStock
      ? `EN STOCK · ${product.stock} ${product.stock === 1 ? 'DISPONIBLE' : 'DISPONIBLES'}`
      : 'SIN STOCK';

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
            <h1 className={display + ' mt-7 text-zip leading-none'}>{product.title}</h1>

            <div className='mt-4'>
              <strong className={display + ' text-zip leading-none tabular-nums'}>S/ {product.price}</strong>
            </div>

            <p
              className={
                label + ` mt-4 flex items-center gap-2 text-micro ${hasStock || isDigital ? 'text-blue' : 'text-muted'}`
              }
            >
              <i className='block size-1.5 rounded-full bg-current' /> {stockLabel}
            </p>

            {hasStock && (
              <div className='my-5 flex flex-col gap-3 sm:flex-row'>
                <button
                  className={
                    label +
                    ' inline-flex cursor-pointer items-center justify-center gap-4 bg-blue px-5 py-4 text-white transition duration-200 hover:-translate-y-0.75 hover:bg-ink'
                  }
                  type='button'
                >
                  AGREGAR AL CARRITO <ShoppingCart aria-hidden='true' className='size-4.5 shrink-0' strokeWidth={1.5} />
                </button>
                <button
                  className={
                    label +
                    ' inline-flex cursor-pointer items-center justify-center bg-ink px-5 py-4 text-paper transition duration-200 hover:-translate-y-0.75 hover:bg-aqua hover:text-ink'
                  }
                  type='button'
                >
                  COMPRAR AHORA
                </button>
              </div>
            )}

            {product.description && <ProductDescription content={product.description} />}
          </div>
        </div>
      </Container>
    </main>
  );
}

import { Container } from './container';
import { Arrow, display, displayItalic, kicker, textLink } from './ui';
import Link from 'next/link';
import { Product } from '../interfaces/store';
import { ShopProductCard } from './shop-product-card';

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section className='py-20 lg:py-32' id='productos'>
      <Container>
        <div className='mb-12 flex items-end justify-between max-md:mb-9'>
          <div>
            <p className={kicker}>
              <i className='block h-2 w-2 rounded-full bg-blue' /> RECIÉN LLEGADOS
            </p>
            <h2 className={'mt-6 text-section leading-display ' + display + ' max-md:text-6xl'}>
              Últimos
              <br />
              <em className={displayItalic + ' text-blue'}>productos.</em>
            </h2>
          </div>
          <Link className={textLink + ' max-md:hidden'} href='/tienda'>
            VER TODO <Arrow />
          </Link>
        </div>
        <div className='grid grid-cols-3 gap-6 lg:gap-9 max-md:grid-cols-1 max-md:gap-11'>
          {products.map((product) => (
            <ShopProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

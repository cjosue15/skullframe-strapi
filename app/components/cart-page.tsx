import Image from 'next/image';
import Link from 'next/link';
import { products } from '../data/products';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { Arrow, display, label, textLink } from './ui';

const cartItems = [
  { product: products[0], quantity: 1 },
  { product: products[2], quantity: 1 },
];

function CartPreview({ itemIndex }: { itemIndex: number }) {
  const product = cartItems[itemIndex].product;

  if (product.image) {
    return (
      <div className='flex aspect-square w-28 shrink-0 items-center justify-center bg-card-drone max-md:w-24'>
        <Image
          className='w-full drop-shadow-lg'
          src={product.image}
          alt={product.imageAlt ?? product.name}
          width={240}
          height={160}
        />
      </div>
    );
  }

  return (
    <div
      className='flex aspect-square w-28 shrink-0 items-center justify-center bg-blue max-md:w-24'
      aria-hidden='true'
    >
      <span className={display + ' -rotate-6 bg-aqua px-3 py-4 text-3xl text-ink'}>.PDF</span>
    </div>
  );
}

export function CartPage() {
  return (
    <main className='bg-paper pb-20 md:pb-32'>
      <Container>
        <Breadcrumbs items={[{ label: 'INICIO', href: '/' }, { label: 'BOLSA' }]} />

        <div className='border-t border-line pt-9 md:pt-12'>
          <div className='flex items-end justify-between gap-6 max-md:items-start'>
            <div>
              <p className={label + ' flex items-center gap-2 text-micro text-muted'}>
                <i className='block size-2 rounded-full bg-blue' /> PEDIDO / 02
              </p>
              <h1 className={display + ' mt-5 text-section leading-display'}>Tu bolsa</h1>
            </div>
            <Link className={textLink + ' mb-1 shrink-0 max-md:hidden'} href='/tienda'>
              SEGUIR EXPLORANDO <Arrow />
            </Link>
          </div>

          <div className='mt-11 grid items-start gap-14 lg:grid-cols-12 lg:gap-20'>
            <section className='lg:col-span-7' aria-labelledby='cart-items-title'>
              <h2
                className={label + ' flex justify-between border-b border-line pb-4 text-micro text-muted'}
                id='cart-items-title'
              >
                <span>OBJETOS SELECCIONADOS</span>
                <span>SUBTOTAL</span>
              </h2>
              <ul>
                {cartItems.map(({ product, quantity }, index) => (
                  <li className='flex gap-6 border-b border-line py-6 max-md:gap-4' key={product.slug}>
                    <CartPreview itemIndex={index} />
                    <div className='flex min-w-0 flex-1 flex-col justify-between py-0.5'>
                      <div className='flex items-start justify-between gap-5'>
                        <div>
                          <p className={label + ' text-micro text-muted'}>
                            {product.kind} · {product.category}
                          </p>
                          <Link
                            className={display + ' mt-2 block text-product leading-product hover:text-blue'}
                            href={'/tienda/' + product.slug}
                          >
                            {product.name}
                          </Link>
                        </div>
                        <strong className={display + ' shrink-0 text-xl leading-none'}>{product.price}</strong>
                      </div>
                      <div className='mt-5 flex items-center justify-between gap-4'>
                        <div
                          className={label + ' inline-flex items-center border border-line text-micro'}
                          aria-label={'Cantidad de ' + product.name}
                        >
                          <button
                            className='flex size-7 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-soft-blue hover:text-ink'
                            type='button'
                            aria-label={'Reducir cantidad de ' + product.name}
                          >
                            −
                          </button>
                          <span className='grid size-7 place-content-center border-x border-line'>{quantity}</span>
                          <button
                            className='flex size-7 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-soft-blue hover:text-ink'
                            type='button'
                            aria-label={'Aumentar cantidad de ' + product.name}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className={
                            label +
                            ' cursor-pointer text-micro text-muted underline decoration-line underline-offset-3 transition-colors hover:text-blue'
                          }
                          type='button'
                        >
                          QUITAR
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link className={textLink + ' mt-7 max-md:inline-flex'} href='/tienda'>
                SEGUIR EXPLORANDO <Arrow />
              </Link>
            </section>

            <aside
              className='bg-ink p-7 text-paper lg:col-span-5 lg:sticky lg:top-25 md:p-9'
              aria-labelledby='summary-title'
            >
              <p className={label + ' text-micro text-muted-on-dark'}>RESUMEN DEL PEDIDO</p>
              <h2 className={display + ' mt-3 text-4xl leading-product'} id='summary-title'>
                Listo para
                <br />
                despegar.
              </h2>
              <dl className={label + ' mt-10 space-y-4 border-y border-paper/20 py-5 text-micro'}>
                <div className='flex justify-between gap-6'>
                  <dt className='text-muted-on-dark'>SUBTOTAL</dt>
                  <dd>S/ 3,509</dd>
                </div>
                <div className='flex justify-between gap-6'>
                  <dt className='text-muted-on-dark'>ENVÍO</dt>
                  <dd>SE CALCULA AL FINAL</dd>
                </div>
              </dl>
              <div className='mt-6 flex items-end justify-between gap-5'>
                <span className={label + ' text-micro text-muted-on-dark'}>TOTAL</span>
                <strong className={display + ' text-4xl leading-none'}>S/ 3,509</strong>
              </div>
              <button
                className={
                  label +
                  ' mt-8 flex w-full cursor-pointer items-center justify-between bg-aqua px-5 py-4 text-ink transition duration-200 hover:bg-paper'
                }
                type='button'
              >
                IR A PAGAR <Arrow />
              </button>
              <p className='mt-5 text-caption leading-copy text-muted-on-dark'>
                El envío se calcula con tu dirección en el siguiente paso.
              </p>
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}

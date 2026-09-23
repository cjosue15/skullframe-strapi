'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useBagStore } from '../stores/use-bag-store';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { Arrow, display, label, textLink } from './ui';

export function CartPage() {
  const items = useBagStore((state) => state.items);
  const removeItem = useBagStore((state) => state.removeItem);
  const updateQuantity = useBagStore((state) => state.updateQuantity);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <main className='bg-paper pb-20 md:pb-32'>
      <Container>
        <Breadcrumbs items={[{ label: 'INICIO', href: '/' }, { label: 'BOLSA' }]} />

        <div className='border-t border-line pt-9 md:pt-12'>
          <div className='flex items-end justify-between gap-6 max-md:items-start'>
            <div>
              <p className={label + ' flex items-center gap-2 text-micro text-muted'}>
                <i className='block size-2 rounded-full bg-blue' /> PEDIDO / {itemCount.toString().padStart(2, '0')}
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
                <span>OBJETOS SELECCIONADOS / {itemCount}</span>
                <span>SUBTOTAL</span>
              </h2>
              {items.length ? (
                <ul>
                  {items.map((product) => (
                    <li className='flex gap-6 border-b border-line py-6 max-md:gap-4' key={product.slug}>
                      <div className='relative aspect-square w-28 shrink-0 overflow-hidden bg-card-component max-md:w-24'>
                        <Image className='object-cover' src={product.cover} alt={product.title} fill sizes='112px' />
                      </div>
                      <div className='flex min-w-0 flex-1 flex-col justify-between py-0.5'>
                        <div className='flex items-start justify-between gap-5'>
                          <div>
                            <p className={label + ' text-micro text-muted'}>
                              {product.type === 'DIGITAL' ? 'DESCARGABLE' : 'FÍSICO'} · {product.category}
                            </p>
                            <Link
                              className={display + ' mt-2 block text-product leading-product hover:text-blue'}
                              href={'/tienda/' + product.slug}
                            >
                              {product.title}
                            </Link>
                          </div>
                          <strong className={display + ' shrink-0 text-xl leading-none'}>
                            S/ {product.price * product.quantity}
                          </strong>
                        </div>
                        <div className='mt-5 flex items-center justify-between gap-4'>
                          <div
                            className={label + ' inline-flex items-center border border-line text-micro'}
                            aria-label={'Cantidad de ' + product.title}
                          >
                            <button
                              className='flex size-7 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-soft-blue hover:text-ink'
                              type='button'
                              aria-label={'Reducir cantidad de ' + product.title}
                              onClick={() => updateQuantity(product.slug, product.quantity - 1)}
                            >
                              −
                            </button>
                            <span className='grid size-7 place-content-center border-x border-line'>{product.quantity}</span>
                            <button
                              className='flex size-7 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-soft-blue hover:text-ink'
                              type='button'
                              aria-label={'Aumentar cantidad de ' + product.title}
                              onClick={() => updateQuantity(product.slug, product.quantity + 1)}
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
                            onClick={() => removeItem(product.slug)}
                          >
                            QUITAR
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='border-b border-line py-12'>
                  <p className='max-w-sm text-lg leading-copy text-muted'>Aún no tienes objetos en la bolsa.</p>
                  <Link className={textLink + ' mt-7'} href='/tienda'>
                    EXPLORAR PRODUCTOS <Arrow />
                  </Link>
                </div>
              )}
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
                  <dd>S/ {subtotal}</dd>
                </div>
                <div className='flex justify-between gap-6'>
                  <dt className='text-muted-on-dark'>ENVÍO</dt>
                  <dd>SE CALCULA AL FINAL</dd>
                </div>
              </dl>
              <div className='mt-6 flex items-end justify-between gap-5'>
                <span className={label + ' text-micro text-muted-on-dark'}>TOTAL</span>
                <strong className={display + ' text-4xl leading-none'}>S/ {subtotal}</strong>
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

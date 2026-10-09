'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, LockKeyhole, Mail } from 'lucide-react';
import { useBagStore } from '../stores/use-bag-store';
import { Breadcrumbs } from './breadcrumbs';
import { Container } from './container';
import { Arrow, display, label, textLink } from './ui';
import PaymentButton from '../(site)/checkout/payment-button';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const priceFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

export function CheckoutPage({ idempotencyKey }: { idempotencyKey: string }) {
  const [email, setEmail] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const items = useBagStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => () => toast.remove('checkout-error'), []);

  const showError = (message: string) =>
    toast.error(message, {
      id: 'checkout-error',
      ariaProps: { role: 'alert', 'aria-live': 'assertive' },
    });

  const handleValidation = () => {
    toast.remove('checkout-error');
    setEmailError(null);
    setTermsError(null);

    const normalizedEmail = email.trim();
    if (
      !normalizedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      emailRef.current?.validity.typeMismatch
    ) {
      const message = normalizedEmail
        ? 'Ingresa un correo válido, por ejemplo: tu@correo.com.'
        : 'Ingresa tu correo electrónico para continuar.';
      setEmailError(message);
      showError(message);
      emailRef.current?.focus();
      return false;
    }

    if (!agreeTerms) {
      const message = 'Acepta los términos y condiciones para continuar con la compra.';
      setTermsError(message);
      showError(message);
      termsRef.current?.focus();
      return false;
    }
    return true;
  };

  return (
    <main className='bg-paper pb-20 md:pb-32'>
      <Container>
        <Breadcrumbs
          items={[{ label: 'INICIO', href: '/' }, { label: 'CARRITO', href: '/carrito' }, { label: 'CHECKOUT' }]}
        />

        <div className='border-t border-line pt-9 md:pt-12'>
          <div className='grid items-end gap-8 lg:grid-cols-12'>
            <div className='lg:col-span-8'>
              <p className={label + ' flex items-center gap-2 text-micro text-muted'}>
                <i className='block size-2 rounded-full bg-blue' /> COMPRA DIGITAL /{' '}
                {itemCount.toString().padStart(2, '0')}
              </p>
              <h1 className={display + ' mt-5 text-section leading-none'}>
                Completa tu
                <br />
                compra.
              </h1>
            </div>
            <p className='max-w-md text-lg leading-copy text-muted lg:col-span-4 lg:pb-1'>
              No necesitas crear una cuenta. Usaremos tu correo para confirmar el pago y entregarte tus archivos.
            </p>
          </div>

          {items.length ? (
            <form
              className='mt-12 grid items-start gap-14 lg:grid-cols-12 lg:gap-20'
              id='checkout-form'
              noValidate
              onSubmit={(event) => event.preventDefault()}
            >
              <div className='lg:col-span-7'>
                <section aria-labelledby='contact-title'>
                  <div className='flex items-start gap-5 border-b border-line pb-5'>
                    <span className={label + ' grid size-8 shrink-0 place-items-center bg-ink text-micro text-paper'}>
                      01
                    </span>
                    <div>
                      <h2 className={display + ' text-3xl leading-none'} id='contact-title'>
                        Datos de contacto
                      </h2>
                      <p className='mt-2 text-caption leading-copy text-muted'>
                        Compra como invitado usando solo tu correo.
                      </p>
                    </div>
                  </div>

                  <div className='py-8 md:pl-13'>
                    <label className={label + ' block text-micro'} htmlFor='checkout-email'>
                      CORREO ELECTRÓNICO
                    </label>
                    <div className='relative mt-3'>
                      <Mail
                        aria-hidden='true'
                        className='pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted'
                        strokeWidth={1.5}
                      />
                      <input
                        className={`h-14 w-full border bg-transparent pr-4 pl-12 text-base outline-none transition-colors placeholder:text-muted/70 ${emailError ? 'border-red-700 focus:border-red-700' : 'border-line focus:border-blue'}`}
                        ref={emailRef}
                        id='checkout-email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        autoCapitalize='none'
                        spellCheck={false}
                        placeholder='tu@correo.com'
                        required
                        value={email}
                        aria-invalid={emailError ? true : undefined}
                        aria-describedby={
                          emailError ? 'checkout-email-error checkout-email-hint' : 'checkout-email-hint'
                        }
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(null);
                        }}
                        onBlur={() => setEmail((value) => value.trim())}
                      />
                    </div>

                    <p className='mt-3 text-small leading-copy text-muted' id='checkout-email-hint'>
                      Aquí recibirás la confirmación y el acceso a tus descargables.
                    </p>
                  </div>
                </section>

                <section className='mt-4' aria-labelledby='delivery-title'>
                  <div className='flex items-start gap-5 border-b border-line pb-5'>
                    <span className={label + ' grid size-8 shrink-0 place-items-center bg-aqua text-micro text-ink'}>
                      02
                    </span>
                    <div>
                      <h2 className={display + ' text-3xl leading-none'} id='delivery-title'>
                        Entrega digital
                      </h2>
                      <p className='mt-2 text-caption leading-copy text-muted'>Sin dirección ni costos de envío.</p>
                    </div>
                  </div>

                  <div className='py-8 md:pl-13'>
                    <div className='flex gap-5 bg-soft-blue p-5 md:items-center md:p-6'>
                      <span className='grid size-11 shrink-0 place-items-center bg-blue text-white'>
                        <Download aria-hidden='true' className='size-5' strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className={label + ' text-micro text-blue'}>DISPONIBLE DESPUÉS DEL PAGO</p>
                        <p className='mt-2 text-caption leading-copy'>
                          Te enviaremos un enlace seguro cuando confirmemos tu compra.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <label className='flex cursor-pointer items-start gap-3 border-t border-line pt-6 text-caption leading-copy'>
                  <input
                    className='mt-1 size-4 shrink-0 accent-blue'
                    name='terms'
                    ref={termsRef}
                    type='checkbox'
                    required
                    checked={agreeTerms}
                    aria-invalid={termsError ? true : undefined}
                    aria-describedby={termsError ? 'checkout-terms-error' : undefined}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setTermsError(null);
                    }}
                  />
                  <span>
                    Acepto los términos y condiciones y autorizo el uso de mi correo para gestionar esta compra.
                  </span>
                </label>
              </div>

              <aside
                className='bg-ink p-7 text-paper lg:sticky lg:top-25 lg:col-span-5 md:p-9'
                aria-labelledby='order-title'
              >
                <div className='flex items-start justify-between gap-5 border-b border-paper/20 pb-5'>
                  <div>
                    <p className={label + ' text-micro text-muted-on-dark'}>TU PEDIDO</p>
                    <h2 className={display + ' mt-2 text-4xl leading-none'} id='order-title'>
                      Resumen
                    </h2>
                  </div>
                  <Link
                    className={
                      label +
                      ' border-b border-paper/40 pb-1 text-micro transition-colors hover:border-aqua hover:text-aqua'
                    }
                    href='/carrito'
                  >
                    EDITAR
                  </Link>
                </div>

                <ul className='divide-y divide-paper/20'>
                  {items.map((product) => (
                    <li className='flex gap-4 py-5' key={product.id}>
                      <div className='relative aspect-square w-18 shrink-0 overflow-hidden bg-card-component'>
                        <Image className='object-cover' src={product.cover} alt='' fill sizes='72px' />
                      </div>
                      <div className='flex min-w-0 flex-1 flex-col justify-between py-0.5'>
                        <div>
                          <p className={label + ' text-micro text-muted-on-dark'}>DESCARGABLE</p>
                          <p className={display + ' mt-1 text-xl leading-product'}>{product.title}</p>
                        </div>
                        <div className={label + ' mt-3 flex justify-between gap-4 text-micro'}>
                          <span className='text-muted-on-dark'>CANT. {product.quantity}</span>
                          <span>{priceFormatter.format(product.price * product.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className={label + ' border-t border-paper/20 pt-5 text-micro'}>
                  <div className='flex justify-between gap-6'>
                    <dt className='text-muted-on-dark'>SUBTOTAL</dt>
                    <dd>{priceFormatter.format(subtotal)}</dd>
                  </div>
                  <div className='mt-4 flex justify-between gap-6'>
                    <dt className='text-muted-on-dark'>ENTREGA DIGITAL</dt>
                    <dd>S/ 0.00</dd>
                  </div>
                </dl>

                <div className='mt-6 flex items-end justify-between gap-5 border-t border-paper/20 pt-6'>
                  <span className={label + ' text-micro text-muted-on-dark'}>TOTAL</span>
                  <strong className={display + ' text-4xl leading-none'}>{priceFormatter.format(subtotal)}</strong>
                </div>

                <PaymentButton
                  idempotencyKey={idempotencyKey}
                  email={email.trim()}
                  handleValidation={handleValidation}
                  onError={showError}
                />
                <p className='mt-5 flex items-start gap-2 text-small leading-copy text-muted-on-dark'>
                  <LockKeyhole aria-hidden='true' className='size-4 shrink-0' strokeWidth={1.5} />
                  Tus datos de pago serán procesados de forma segura.
                </p>
              </aside>
            </form>
          ) : (
            <section className='mt-12 border-y border-line py-16 md:py-20'>
              <p className={display + ' text-4xl leading-none'}>Tu carrito está vacío.</p>
              <p className='mt-4 max-w-md text-lg leading-copy text-muted'>
                Explora nuestros productos digitales y vuelve cuando encuentres algo que quieras construir.
              </p>
              <Link className={textLink + ' mt-8'} href='/tienda'>
                VER PRODUCTOS <Arrow />
              </Link>
            </section>
          )}
        </div>
      </Container>
    </main>
  );
}

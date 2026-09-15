import Image from 'next/image';
import Link from 'next/link';
import { Container } from './container';
import { Arrow, display, label } from './ui';

export function SiteFooter() {
  return (
    <footer className='bg-aqua pt-14 pb-6' id='contacto'>
      <Container>
        <div className='grid grid-cols-3 items-start gap-8 pb-18 max-md:block max-md:pb-15'>
          <Link className={'flex items-center gap-2.25 text-logo ' + display} href='/'>
            <Image
              className='h-9 w-16 object-contain mix-blend-multiply'
              src='/logo.png'
              alt=''
              width={1485}
              height={394}
            />
            <span>SKULLFRAME</span>
          </Link>
          <p className='max-w-57.5 text-sm leading-footer max-md:mt-7 max-md:mb-9'>
            Una selección pequeña para hacer cosas grandes.
          </p>
          <a
            className='flex justify-end gap-5 font-display text-footer-contact font-black tracking-brand-soft underline decoration-1 underline-offset-1.75 max-md:justify-start max-md:text-4xl'
            href='mailto:hola@skullframe.pe'
          >
            HOLA@SKULLFRAME.PE <Arrow />
          </a>
        </div>
        <div
          className={
            label +
            ' flex justify-between border-t border-ink/25 pt-5 text-micro max-md:flex-col max-md:items-start max-md:gap-5'
          }
        >
          <span>© 2026 SKULLFRAME</span>
          <div className='flex gap-6 max-md:order-first max-md:gap-4'>
            <Link className='hover:underline' href='/tienda'>
              INSTAGRAM
            </Link>
            <Link className='hover:underline' href='/tienda'>
              TIKTOK
            </Link>
            <Link className='hover:underline' href='/tienda'>
              TÉRMINOS
            </Link>
          </div>
          <span>HECHO EN PERÚ</span>
        </div>
      </Container>
    </footer>
  );
}

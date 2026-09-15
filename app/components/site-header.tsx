import Image from 'next/image';
import Link from 'next/link';
import { Container } from './container';
import { display, label } from './ui';

const navigation = [
  { label: 'Productos', href: '/tienda' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#contacto' },
];

export function SiteHeader() {
  return (
    <header className='relative z-10 border-b border-line bg-paper/93'>
      <Container className='flex h-19 items-center justify-between max-md:h-16.5'>
        <Link
          className={'flex items-center gap-2.25 text-lg ' + display + ' max-md:text-base'}
          href='/'
          aria-label='Skullframe, inicio'
        >
          <Image
            className='h-6.5 w-12 object-contain mix-blend-multiply max-md:w-10.5'
            src='/logo.png'
            alt='Skullframe'
            width={1485}
            height={394}
            priority
          />
          <span>SKULLFRAME</span>
        </Link>
        <nav className='ml-25 flex gap-10 xl:gap-13 max-md:hidden' aria-label='Navegación principal'>
          {navigation.map((item) => (
            <Link
              className={
                label +
                ' relative uppercase after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-250 hover:after:scale-x-100'
              }
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className={label + ' flex items-center gap-1.5 uppercase'} href='/tienda'>
          BOLSA{' '}
          <sup className='flex size-4 items-center justify-center rounded-full bg-blue text-nano text-white'>0</sup>
        </Link>
      </Container>
    </header>
  );
}

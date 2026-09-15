'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Container } from './container';
import { display, label } from './ui';

const navigation = [
  { label: 'Productos', href: '/tienda' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#contacto' },
];

export function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 24) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
      } else if (Math.abs(scrollDifference) >= 8) {
        setIsVisible(scrollDifference < 0);
        lastScrollY.current = currentScrollY;
      }

      animationFrame.current = null;
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-20 border-b border-line bg-paper/93 transition-transform duration-300 ease-out will-change-transform motion-reduce:translate-y-0 motion-reduce:transition-none ' +
        (isVisible ? 'translate-y-0' : '-translate-y-full')
      }
    >
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
        <Link className={label + ' flex items-center gap-1.5 uppercase'} href='/carrito'>
          BOLSA{' '}
          <sup className='flex size-4 items-center justify-center rounded-full bg-blue text-nano text-white'>0</sup>
        </Link>
      </Container>
    </header>
  );
}

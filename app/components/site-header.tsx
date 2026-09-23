'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBagStore } from '../stores/use-bag-store';
import { Container } from './container';
import { display, label } from './ui';

const navigation = [
  { label: 'Productos', href: '/tienda' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#contacto' },
];

export function SiteHeader() {
  const itemCount = useBagStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isMenuOpen]);

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
        if (scrollDifference > 0) setIsMenuOpen(false);
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
    <>
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
          <div className='flex items-center gap-4'>
            <Link className={label + ' flex items-center gap-1.5 uppercase'} href='/carrito' onClick={() => setIsMenuOpen(false)}>
              BOLSA{' '}
              <sup className='flex size-4 items-center justify-center rounded-full bg-blue text-nano text-white'>{itemCount}</sup>
            </Link>
            <button
              className='hidden size-11 cursor-pointer place-items-center text-ink max-md:grid'
              type='button'
              aria-controls='mobile-navigation'
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            >
              {isMenuOpen ? (
                <X aria-hidden='true' className='size-5' strokeWidth={1.75} />
              ) : (
                <Menu aria-hidden='true' className='size-5' strokeWidth={1.75} />
              )}
            </button>
          </div>
        </Container>
      </header>
      {isMenuOpen
        ? createPortal(
            <div className='fixed inset-0 z-50 overflow-hidden bg-paper md:hidden' role='dialog' aria-modal='true'>
              <div className='border-b border-line'>
                <Container className='flex h-16.5 items-center justify-between'>
                  <Link
                    className={'flex items-center gap-2.25 text-base ' + display}
                    href='/'
                    aria-label='Skullframe, inicio'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image
                      className='h-6.5 w-10.5 object-contain mix-blend-multiply'
                      src='/logo.png'
                      alt='Skullframe'
                      width={1485}
                      height={394}
                    />
                    <span>SKULLFRAME</span>
                  </Link>
                  <div className='flex items-center gap-4'>
                    <Link
                      className={label + ' flex items-center gap-1.5 uppercase'}
                      href='/carrito'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      BOLSA{' '}
                      <sup className='flex size-4 items-center justify-center rounded-full bg-blue text-nano text-white'>{itemCount}</sup>
                    </Link>
                    <button
                      className='grid size-11 cursor-pointer place-items-center text-ink'
                      type='button'
                      aria-label='Cerrar navegación'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X aria-hidden='true' className='size-5' strokeWidth={1.75} />
                    </button>
                  </div>
                </Container>
              </div>
              <Container className='pt-14'>
                <nav className='grid' id='mobile-navigation' aria-label='Navegación móvil'>
                  {navigation.map((item) => (
                    <Link
                      className={display + ' border-b border-line py-6 text-5xl leading-none last:border-none'}
                      href={item.href}
                      key={item.label}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </Container>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

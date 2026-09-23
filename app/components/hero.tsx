import Image from 'next/image';
import { Container } from './container';
import { Arrow, display, displayItalic, kicker, label } from './ui';

export function Hero() {
  return (
    <section className='relative min-h-137.5 overflow-hidden bg-soft-blue md:min-h-180 max-md:min-h-165' id='inicio'>
      <div
        className='pointer-events-none absolute top-1/4 -left-83.75 size-115 rounded-full border border-blue/26 max-md:-left-58 max-md:size-75'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -right-62.5 -bottom-90 size-145 rounded-full border border-blue/26 max-md:hidden'
        aria-hidden='true'
      />
      <Container className='relative grid min-h-126.5 grid-cols-2 pt-14 pb-14 md:min-h-168.75 md:pt-20 max-md:block max-md:min-h-153.75 max-md:pt-14 max-md:pb-12'>
        <div className='relative z-2 self-center max-md:max-w-70'>
          <p className={kicker}>
            <i className='block size-2 rounded-full bg-blue' /> TECNOLOGÍA PARA EXPLORAR
          </p>
          <h1 className={'mt-7 mb-8 text-hero leading-hero ' + display + ' max-md:mt-6 max-md:mb-6 max-md:text-7xl'}>
            Ideas que
            <br />
            <em className={displayItalic + ' text-blue'}>despegan.</em>
          </h1>
          <p className='max-w-85 text-base leading-copy max-md:max-w-63.5 max-md:text-sm'>
            Equipos, componentes y archivos digitales para quienes prefieren crear, probar y volver a intentar.
          </p>
          <a
            className={
              label +
              ' mt-8 inline-flex items-center gap-7 bg-blue px-5 py-4 text-white transition duration-200 hover:-translate-y-0.75 hover:bg-ink'
            }
            href='#productos'
          >
            VER PRODUCTOS <Arrow />
          </a>
        </div>
        <div
          className='relative z-1 h-146.25 w-180 self-center justify-self-end max-md:absolute max-md:-right-15 max-md:bottom-3.25 max-md:h-77.5 max-md:w-116.25'
          role='img'
          aria-label='Dron Mavic Pro en vuelo'
        >
          <span className={label + ' absolute top-0 right-0 z-3 text-micro max-md:right-1/6'}>01 / 01</span>

          <span
            className='absolute top-1/2 -left-12 z-1 h-20 w-200 -rotate-7 bg-linear-to-r from-transparent via-blue/10 to-transparent blur-2xl'
            aria-hidden='true'
          />
          <span
            className='absolute top-16 left-24 h-110 w-137 rounded-full bg-aqua max-md:top-9 max-md:h-58 max-md:w-88'
            aria-hidden='true'
          />
          <span
            className='absolute top-0 left-3 h-141 w-174 -rotate-28 rounded-full border border-blue'
            aria-hidden='true'
          />
          <div
            className='absolute top-38 left-0 z-2 h-auto w-200 animate-fly-by opacity-0 drop-shadow-xl will-change-transform max-md:top-20 max-md:w-116.25 motion-reduce:-translate-x-12 motion-reduce:-translate-y-2 motion-reduce:-rotate-3 motion-reduce:animate-none motion-reduce:opacity-100'
            aria-hidden='true'
          >
            <div className='w-full animate-flight-stabilize-a will-change-transform motion-reduce:animate-none'>
              <Image
                className='block h-auto w-full'
                src='/dron.png'
                alt=''
                width={960}
                height={447}
                sizes='(max-width: 767px) 465px, 800px'
                priority
              />
            </div>
          </div>
          <div
            className='absolute top-38 left-0 z-2 h-auto w-200 animate-fly-by-delayed opacity-0 drop-shadow-xl will-change-transform max-md:top-20 max-md:w-116.25 motion-reduce:hidden'
            aria-hidden='true'
          >
            <div className='w-full animate-flight-stabilize-b will-change-transform motion-reduce:animate-none'>
              <Image
                className='block h-auto w-full'
                src='/dron.png'
                alt=''
                width={960}
                height={447}
                sizes='(max-width: 767px) 465px, 800px'
                priority
              />
            </div>
          </div>
        </div>
      </Container>
      <div className='absolute bottom-6 w-full max-md:bottom-4'>
        <Container className={label + ' flex gap-3 text-micro uppercase max-md:text-nano'}>
          <span>ENVÍOS A TODO EL PERÚ</span>
          <span>·</span>
          <span>FÍSICO + DIGITAL</span>
        </Container>
      </div>
    </section>
  );
}

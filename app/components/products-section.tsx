import Image from 'next/image';
import { Container } from './container';
import { Arrow, display, displayItalic, kicker, label, textLink } from './ui';

const products = [
  {
    kind: 'FÍSICO · DRONES',
    name: 'Mavic Pro',
    description: 'Cámara 4K, 27 min de vuelo y un formato que cabe en la mochila.',
    price: 'S/ 3,490',
    image: '/dron.png',
    imageAlt: 'Dron Mavic Pro gris',
    visualClass: 'bg-card-drone',
    imageClass:
      'relative z-10 h-auto w-full -rotate-6 drop-shadow-lg transition-transform duration-350 group-hover:-rotate-2 group-hover:scale-104',
  },
  {
    kind: 'FÍSICO · COMPONENTES',
    name: 'XT60 Connector Set',
    description: 'Conectores de alta corriente para baterías, controladores y tus próximos prototipos.',
    price: 'S/ 24',
    image: '/product.jpeg',
    imageAlt: 'Conector XT60 dorado',
    visualClass: 'bg-card-component',
    imageClass:
      'relative z-10 size-2/3 object-contain drop-shadow-lg transition-transform duration-350 group-hover:-rotate-7 group-hover:scale-107',
  },
  {
    kind: 'DIGITAL · DESCARGABLE',
    name: 'Starter Flight Plans',
    description: 'Planos, lista de piezas y configuraciones base para iniciar tu proyecto FPV.',
    price: 'S/ 19',
    visualClass: 'bg-blue',
  },
];

export function ProductsSection() {
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
          <a className={textLink + ' max-md:hidden'} href='#productos'>
            VER TODO <Arrow />
          </a>
        </div>
        <div className='grid grid-cols-3 gap-6 lg:gap-9 max-md:grid-cols-1 max-md:gap-11'>
          {products.map((product, index) => (
            <article className='min-w-0' key={product.name}>
              <a
                className={
                  'group relative flex h-80 items-center justify-center overflow-hidden md:h-96 lg:h-105 ' +
                  product.visualClass
                }
                href='#productos'
                aria-label={'Ver ' + product.name}
              >
                <span
                  className={label + ' absolute top-4 left-4 z-3 text-micro ' + (product.image ? '' : 'text-white')}
                >
                  0{index + 1}
                </span>
                {product.image ? (
                  <Image
                    className={product.imageClass}
                    src={product.image}
                    alt={product.imageAlt ?? ''}
                    width={index === 0 ? 960 : 554}
                    height={index === 0 ? 447 : 554}
                  />
                ) : (
                  <span
                    className='relative z-1 flex h-52 w-43.5 rotate-7 flex-col justify-between bg-aqua p-4 text-ink transition-transform duration-350 group-hover:-translate-y-1.75 group-hover:rotate-0'
                    aria-hidden='true'
                  >
                    <b className={display + ' text-zip'}>.ZIP</b>
                    <small className={label + ' text-micro leading-file'}>
                      FLIGHT
                      <br />
                      PLANS
                    </small>
                    <i className='absolute top-0 right-0 border-t-5 border-l-5 border-t-blue border-l-transparent' />
                  </span>
                )}
                <span
                  className={
                    'absolute right-4 bottom-4 z-3 flex size-7 items-center justify-center rounded-full bg-paper text-lg transition-colors duration-200 group-hover:bg-blue group-hover:text-white ' +
                    (product.image ? '' : 'text-blue')
                  }
                  aria-hidden='true'
                >
                  +
                </span>
              </a>
              <p className={label + ' mt-4.5 mb-3 text-micro text-muted'}>{product.kind}</p>
              <div className='flex items-baseline justify-between gap-3'>
                <h3 className={display + ' text-product leading-product max-md:text-3xl'}>
                  {product.name}
                </h3>
                <strong className='shrink-0 font-body text-small font-semibold'>{product.price}</strong>
              </div>
              <p className='mt-3 max-w-xs text-caption leading-caption text-muted max-md:text-sm'>
                {product.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { Arrow, display, displayItalic, kicker, label, textLink } from './ui';
import { Container } from './container';

export function AboutSection() {
  return (
    <section className='relative overflow-hidden bg-ink text-paper' id='nosotros'>
      <div
        className='pointer-events-none absolute -top-9 -right-15 flex gap-12 font-display text-plus leading-none font-thin text-aqua/13'
        aria-hidden='true'
      >
        <span>+</span>
        <span className='translate-y-1/4'>+</span>
        <span className='-translate-y-1/12'>+</span>
      </div>
      <Container className='relative z-2 grid grid-cols-3 py-16 lg:py-28 max-md:block'>
        <div className='self-start'>
          <p className={kicker + ' text-muted-on-dark'}>
            <i className='block h-2 w-2 rounded-full bg-aqua' /> QUIÉNES SOMOS
          </p>
          <span className={label + ' mt-5 block text-micro text-muted-on-dark'}>DESDE LIMA, PERÚ</span>
        </div>
        <div className='col-span-2 max-md:mt-16 md:pt-6'>
          <h2 className={display + ' text-section leading-display max-md:text-6xl'}>
            Una tienda para
            <br />
            <em className={displayItalic + ' text-aqua'}>manos inquietas.</em>
          </h2>
          <p className='mt-8 mb-8 max-w-md text-base leading-normal max-md:max-w-82.5 max-md:text-sm'>
            Skullframe reúne la tecnología que nos gusta usar: piezas bien elegidas, drones que dan ganas de salir y
            recursos que acortan la distancia entre una idea y su primera prueba.
          </p>
          <a className={textLink + ' border-paper/65 hover:border-aqua hover:text-aqua'} href='#contacto'>
            CONOCER SKULLFRAME <Arrow />
          </a>
        </div>
      </Container>
    </section>
  );
}

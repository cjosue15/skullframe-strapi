import { Container } from './container';

const thumbnailPlaceholders = Array.from({ length: 4 }, (_, index) => index);

export function ProductDetailLoading() {
  return (
    <main className='bg-paper pb-20 md:pb-32' aria-busy='true' aria-live='polite'>
      <Container>
        <div className='flex gap-2 py-7'>
          <span className='block h-3 w-12 animate-pulse bg-soft-blue motion-reduce:animate-none' />
          <span className='block h-3 w-2 animate-pulse bg-soft-blue motion-reduce:animate-none' />
          <span className='block h-3 w-14 animate-pulse bg-soft-blue motion-reduce:animate-none' />
          <span className='block h-3 w-2 animate-pulse bg-soft-blue motion-reduce:animate-none' />
          <span className='block h-3 w-28 animate-pulse bg-soft-blue motion-reduce:animate-none' />
        </div>

        <div className='grid border-t border-line pt-8 md:grid-cols-2 md:gap-12 md:pt-12'>
          <section aria-hidden='true'>
            <div className='aspect-video animate-pulse border border-line bg-soft-blue motion-reduce:animate-none' />
            <div className='mt-3 grid grid-cols-4 gap-3'>
              {thumbnailPlaceholders.map((thumbnail) => (
                <div
                  className='aspect-square animate-pulse border border-line bg-soft-blue motion-reduce:animate-none'
                  key={thumbnail}
                />
              ))}
            </div>
          </section>

          <section className='max-w-120 self-start max-md:mt-10' aria-hidden='true'>
            <span className='block h-3 w-36 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            <div className='mt-7 space-y-3'>
              <span className='block h-14 w-full animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-14 w-3/4 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            </div>
            <span className='mt-6 block h-10 w-32 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            <span className='mt-5 block h-3 w-36 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            <div className='my-5 flex flex-col gap-3 sm:flex-row'>
              <span className='block h-13 w-56 animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-13 w-40 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            </div>
            <div className='mt-8 space-y-3'>
              <span className='block h-4 w-full animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-4 w-11/12 animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-4 w-4/5 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            </div>
          </section>
        </div>
      </Container>
      <span className='sr-only'>Cargando producto</span>
    </main>
  );
}

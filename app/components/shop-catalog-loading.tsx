import { Container } from './container';

const skeletonCards = Array.from({ length: 9 }, (_, index) => index);

export function ShopCatalogLoading() {
  return (
    <main aria-busy='true' aria-live='polite'>
      <section className='min-h-screen bg-paper'>
        <Container>
          <div className='border-b border-line pb-12 pt-14 md:pb-16 md:pt-20'>
            <span className='block h-3 w-32 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            <div className='mt-7 flex items-end justify-between gap-8 max-md:block'>
              <div className='space-y-3'>
                <span className='block h-14 w-88 max-w-full animate-pulse bg-soft-blue md:h-20 motion-reduce:animate-none' />
                <span className='block h-14 w-72 max-w-full animate-pulse bg-soft-blue md:h-20 motion-reduce:animate-none' />
              </div>
              <div className='w-72 max-w-full space-y-3 max-md:mt-8'>
                <span className='block h-4 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                <span className='block h-4 w-5/6 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                <span className='block h-4 w-2/3 animate-pulse bg-soft-blue motion-reduce:animate-none' />
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between gap-6 py-7 max-md:block'>
            <div className='flex flex-wrap gap-7'>
              <span className='block h-3 w-11 animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-3 w-20 animate-pulse bg-soft-blue motion-reduce:animate-none' />
              <span className='block h-3 w-16 animate-pulse bg-soft-blue motion-reduce:animate-none' />
            </div>
            <span className='block h-3 w-35 animate-pulse bg-soft-blue max-md:mt-6 motion-reduce:animate-none' />
          </div>

          <div className='grid grid-cols-1 gap-x-9 gap-y-18 pb-12 sm:grid-cols-2 lg:grid-cols-3 max-md:gap-y-12 md:pb-16'>
            {skeletonCards.map((card) => (
              <div key={card}>
                <div className='aspect-square animate-pulse bg-soft-blue motion-reduce:animate-none' />
                <div className='mt-5 flex items-start justify-between gap-5'>
                  <div className='flex-1 space-y-3'>
                    <span className='block h-3 w-28 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                    <span className='block h-8 w-3/4 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                  </div>
                  <span className='block size-8 animate-pulse rounded-full bg-soft-blue motion-reduce:animate-none' />
                </div>
                <div className='mt-3 flex justify-between gap-4'>
                  <span className='block h-3 w-2/3 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                  <span className='block h-3 w-12 animate-pulse bg-soft-blue motion-reduce:animate-none' />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <Container>
        <div className='flex justify-between border-t border-line pb-6 pt-6'>
          <span className='block h-3 w-40 animate-pulse bg-soft-blue motion-reduce:animate-none' />
          <span className='block h-9 w-72 animate-pulse bg-soft-blue motion-reduce:animate-none' />
        </div>
      </Container>
      <span className='sr-only'>Cargando catálogo</span>
    </main>
  );
}

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { label } from './ui';
import { ProductPagination } from '../interfaces/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  pagination: ProductPagination;
}

type PaginationItem = number | 'leading-ellipsis' | 'trailing-ellipsis';

function getPaginationItems(page: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  if (page <= 4) return [1, 2, 3, 4, 5, 'trailing-ellipsis', pageCount];

  if (page >= pageCount - 3)
    return [1, 'leading-ellipsis', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];

  return [1, 'leading-ellipsis', page - 1, page, page + 1, 'trailing-ellipsis', pageCount];
}

export function Pagination({ pagination }: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageItems = getPaginationItems(pagination.page, pagination.pageCount);
  const hasPreviousPage = pagination.page > 1;
  const hasNextPage = pagination.page < pagination.pageCount;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.set('pageSize', pagination.pageSize.toString());
    router.push(pathname + '?' + params.toString());
  };

  return (
    <nav
      className='flex items-center justify-between border-t border-line pt-6 max-md:flex-col max-md:items-start max-md:gap-4'
      aria-label='Paginación del catálogo'
    >
      <p className={label + ' text-micro text-muted'}>
        PÁGINA {pagination.page.toString().padStart(2, '0')} DE {pagination.pageCount.toString().padStart(2, '0')} ·{' '}
        {pagination.total} OBJETOS
      </p>
      <div className={label + ' flex items-center text-micro'}>
        <button
          className='grid size-9 cursor-pointer place-items-center text-muted disabled:cursor-not-allowed disabled:opacity-40'
          type='button'
          aria-label='Página anterior'
          disabled={!hasPreviousPage}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          <ChevronLeft aria-hidden='true' className='size-4' strokeWidth={1.75} />
        </button>
        {pageItems.map((item) => {
          if (typeof item !== 'number') {
            return (
              <span className='grid size-9 place-items-center text-muted' aria-hidden='true' key={item}>
                …
              </span>
            );
          }

          return (
            <button
              className={
                'grid size-9 cursor-pointer place-items-center border-b-2 transition-colors hover:text-blue disabled:cursor-not-allowed disabled:hover:text-ink ' +
                (item === pagination.page ? 'border-blue text-ink' : 'border-transparent text-muted')
              }
              aria-current={item === pagination.page ? 'page' : undefined}
              aria-label={'Ir a la página ' + item}
              disabled={item === pagination.page}
              type='button'
              onClick={() => handlePageChange(item)}
              key={item}
            >
              {item.toString().padStart(2, '0')}
            </button>
          );
        })}
        <button
          className='grid size-9 cursor-pointer place-items-center text-ink disabled:cursor-not-allowed disabled:opacity-40'
          type='button'
          aria-label='Página siguiente'
          disabled={!hasNextPage}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          <ChevronRight aria-hidden='true' className='size-4' strokeWidth={1.75} />
        </button>
      </div>
    </nav>
  );
}

import Link from 'next/link';
import { label } from './ui';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className={label + ' flex flex-wrap gap-2 py-7 text-micro text-muted'} aria-label='Ruta de navegación'>
      {items.map((item, index) => {
        const isCurrentPage = index === items.length - 1;

        return (
          <span className='flex items-center gap-2' key={item.label}>
            {item.href && !isCurrentPage ? (
              <Link className='hover:text-blue' href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className={isCurrentPage ? 'text-ink' : ''} aria-current={isCurrentPage ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isCurrentPage && <span aria-hidden='true'>/</span>}
          </span>
        );
      })}
    </nav>
  );
}

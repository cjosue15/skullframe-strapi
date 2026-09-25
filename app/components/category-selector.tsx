'use client';

import { Category } from '../interfaces/category';
import { label } from './ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function CategorySelector({ categories, activeCategory }: { categories: Category[]; activeCategory: string | null | undefined }) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const categoriesWithAllOption = [{ id: 0, name: 'TODO', slug: null, description: null }, ...categories];

  const handleCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (activeCategory === slug || slug === null) {
      params.delete('category');
      router.push(pathName + '?' + params.toString());
      return;
    }

    params.set('category', slug);
    router.push(pathName + '?' + params.toString());
  };

  return (
    <nav className='flex flex-wrap gap-x-7 gap-y-4' aria-label='Filtrar catálogo'>
      {categoriesWithAllOption.map((category) => (
        <button
          className={
            label +
            ' cursor-pointer transition-colors hover:text-blue ' +
            (activeCategory === category.slug ? 'text-blue' : 'text-muted')
          }
          type='button'
          aria-pressed={activeCategory === category.slug}
          onClick={() => handleCategory(category.slug)}
          key={category.slug ?? 'all'}
        >
          {category.name.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}

export default CategorySelector;

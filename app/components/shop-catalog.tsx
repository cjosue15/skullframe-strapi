'use client';

import { useState } from 'react';
import { Container } from './container';
import { ShopProductCard } from './shop-product-card';
import { display, displayItalic, kicker, label } from './ui';
import { Product } from '../interfaces/store';
import { Category } from '../interfaces/category';

export function ShopCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  // const visibleProducts = activeFilter === 'TODO' ? products : products.filter((product) => product.category === activeFilter);

  return (
    <section className='min-h-screen bg-paper' aria-labelledby='shop-title'>
      <Container>
        <div className='border-b border-line pb-12 pt-14 md:pb-16 md:pt-20'>
          <p className={kicker}>
            <i className='block size-2 rounded-full bg-blue' /> CATÁLOGO / 2026
          </p>
          <div className='mt-7 flex items-end justify-between gap-8 max-md:block'>
            <h1 className={display + ' text-hero leading-display'} id='shop-title'>
              La tienda para
              <br />
              <em className={displayItalic + ' text-blue'}>seguir haciendo.</em>
            </h1>
            <p className='max-w-72 text-base leading-copy text-muted'>
              Herramientas, piezas y archivos que merecen un lugar en tu mesa de trabajo.
            </p>
          </div>
        </div>
        <div className='flex items-center justify-between gap-6 py-7 max-md:block'>
          <nav className='flex flex-wrap gap-x-7 gap-y-4' aria-label='Filtrar catálogo'>
            <button
              className={
                label +
                ' cursor-pointer text-muted transition-colors hover:text-blue ' +
                (activeFilter === null ? 'text-ink' : '')
              }
              type='button'
              aria-pressed={activeFilter === null}
              onClick={() => setActiveFilter(null)}
            >
              TODO
            </button>
            {categories.map((category) => (
              <button
                className={
                  label +
                  ' cursor-pointer text-muted transition-colors hover:text-blue ' +
                  (activeFilter === category.id ? 'text-ink' : '')
                }
                type='button'
                aria-pressed={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
                key={category.id}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </nav>
          {/* <p className={label + ' text-micro text-muted max-md:mt-6'}>{visibleProducts.length} OBJETOS DISPONIBLES</p> */}
        </div>
        <div
          className='grid grid-cols-3 gap-x-9 gap-y-18 pb-20 max-md:grid-cols-1 max-md:gap-y-12 md:pb-32'
          id='catalogo'
        >
          {products.map((product) => (
            <ShopProductCard key={product.slug} product={product} />
          ))}
          {/* {visibleProducts.map((product) => <ShopProductCard key={product.slug} product={product} />)} */}
        </div>
      </Container>
    </section>
  );
}

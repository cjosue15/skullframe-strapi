'use client';

import { useState } from 'react';
import { useBagStore } from '../stores/use-bag-store';
import type { Product } from '../interfaces/store';

export function AddToBagButton({ product }: { product: Product }) {
  const [wasAdded, setWasAdded] = useState(false);
  const addItem = useBagStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product);
    setWasAdded(true);
  };

  return (
    <button
      className='absolute right-4 bottom-4 z-3 grid size-11 translate-y-3 cursor-pointer pointer-events-none place-items-center rounded-full border border-ink bg-paper text-2xl leading-none text-ink opacity-0 shadow-sm transition duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 hover:scale-105 hover:bg-blue hover:text-white focus-visible:scale-105 focus-visible:bg-blue focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue max-md:pointer-events-auto max-md:translate-y-0 max-md:opacity-100 motion-reduce:transition-none'
      type='button'
      aria-label={wasAdded ? product.title + ' añadido a la bolsa' : 'Añadir ' + product.title + ' a la bolsa'}
      onClick={handleAdd}
    >
      <span aria-hidden='true'>{wasAdded ? '✓' : '+'}</span>
    </button>
  );
}

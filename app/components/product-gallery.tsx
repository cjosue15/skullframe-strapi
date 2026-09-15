'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '../data/products';
import { display } from './ui';

const photoLabels = ['FOTO 01', 'FOTO 02', 'FOTO 03', 'FOTO 04'];

function GalleryImage({ product, isThumbnail = false }: { product: Product; isThumbnail?: boolean }) {
  if (product.image) {
    return (
      <Image
        className={isThumbnail ? 'size-full object-contain' : 'max-h-137 w-full object-contain'}
        src={product.image}
        alt={isThumbnail ? '' : (product.imageAlt ?? product.name)}
        width={960}
        height={447}
        priority={!isThumbnail}
      />
    );
  }

  return (
    <span className={display + ' text-ink ' + (isThumbnail ? 'text-xl' : 'text-zip')} aria-hidden='true'>
      {product.kind === 'DIGITAL' ? '.PDF' : product.name}
    </span>
  );
}

export function ProductGallery({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section aria-label={'Galería de ' + product.name}>
      <figure className='relative flex items-center justify-center overflow-hidden border border-line'>
        <GalleryImage product={product} />
      </figure>
      <div className='mt-3 grid grid-cols-4 gap-3' aria-label='Seleccionar imagen del producto'>
        {photoLabels.map((photoLabel, index) => (
          <button
            className={
              'relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden border transition-colors ' +
              (selectedIndex === index ? 'border-blue' : 'border-line hover:border-ink')
            }
            type='button'
            aria-pressed={selectedIndex === index}
            aria-label={'Mostrar ' + photoLabel.toLowerCase()}
            onClick={() => setSelectedIndex(index)}
            key={photoLabel}
          >
            <GalleryImage product={product} isThumbnail />
          </button>
        ))}
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../interfaces/store';

function GalleryImage({ title, image, isThumbnail = false }: { title: string; image: string; isThumbnail?: boolean }) {
  return (
    <Image
      className={isThumbnail ? 'size-full object-contain' : 'max-h-137 w-full object-contain'}
      src={image}
      alt={isThumbnail ? '' : title}
      width={960}
      height={447}
      priority={!isThumbnail}
    />
  );
}

export function ProductGallery({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section aria-label={'Galería de ' + product.title}>
      <figure className='relative flex items-center justify-center overflow-hidden border border-line'>
        <GalleryImage title={product.title} image={product.images[selectedIndex]} />
      </figure>
      <div className='mt-3 grid grid-cols-4 gap-3' aria-label='Seleccionar imagen del producto'>
        {product.images.map((image, index) => (
          <button
            className={
              'relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden border transition-colors ' +
              (selectedIndex === index ? 'border-blue' : 'border-line hover:border-ink')
            }
            type='button'
            aria-pressed={selectedIndex === index}
            aria-label={'Mostrar imagen ' + (index + 1)}
            onClick={() => setSelectedIndex(index)}
            key={index}
          >
            <GalleryImage title={product.title} image={image} isThumbnail />
          </button>
        ))}
      </div>
    </section>
  );
}

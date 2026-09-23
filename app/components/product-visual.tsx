import Image from 'next/image';
import { label } from './ui';
import { Product } from '../interfaces/store';

export function ProductVisual({ product }: { product: Product }) {
  return (
    <div className='relative aspect-square overflow-hidden bg-card-component'>
      <span className={label + ' absolute top-4 left-4 z-2 text-micro text-ink'}>
        {product.type === 'DIGITAL' ? 'FILE / 01' : 'OBJECT / 01'}
      </span>
      <Image
        className='object-cover transition-transform duration-500 group-hover:scale-105'
        src={product.cover}
        alt={product.title}
        fill
        sizes='(max-width: 767px) calc(100vw - 3rem), (max-width: 1200px) calc((100vw - 6rem) / 3), 355px'
      />
    </div>
  );
}

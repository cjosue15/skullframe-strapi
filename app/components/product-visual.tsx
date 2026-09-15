import Image from 'next/image';
import type { Product } from '../data/products';
import { display, label } from './ui';

type ProductVisualProps = {
  product: Product;
  size?: 'card' | 'detail';
};

export function ProductVisual({ product, size = 'card' }: ProductVisualProps) {
  const sizeClass = size === 'detail' ? 'min-h-156 max-md:min-h-96' : 'min-h-88 max-md:min-h-80';
  const visualClass =
    product.visual === 'drone'
      ? 'bg-card-drone'
      : product.visual === 'component'
        ? 'bg-card-component'
        : product.visual === 'digital'
          ? 'bg-blue'
          : product.visual === 'board'
            ? 'bg-ink'
            : 'bg-soft-blue';

  return (
    <div className={'relative flex overflow-hidden ' + sizeClass + ' items-center justify-center ' + visualClass}>
      <span className={label + ' absolute top-4 left-4 z-3 text-micro ' + (product.visual === 'board' ? 'text-aqua' : '')}>{product.kind === 'DIGITAL' ? 'FILE / 01' : 'OBJECT / 01'}</span>
      {product.image ? (
        <Image
          className={product.visual === 'drone' ? 'relative z-1 w-full drop-shadow-xl' : 'relative z-1 size-2/3 object-contain drop-shadow-lg'}
          src={product.image}
          alt={product.imageAlt ?? product.name}
          width={product.visual === 'drone' ? 960 : 554}
          height={product.visual === 'drone' ? 447 : 554}
          priority={size === 'detail'}
        />
      ) : product.visual === 'digital' ? (
        <span className='relative z-1 flex h-56 w-48 rotate-6 flex-col justify-between bg-aqua p-5 text-ink transition-transform duration-350 group-hover:-translate-y-1.5 group-hover:rotate-0' aria-hidden='true'>
          <b className={display + ' text-zip'}>.PDF</b>
          <small className={label + ' text-micro leading-file'}>SKULLFRAME<br />DOWNLOAD</small>
          <i className='absolute top-0 right-0 border-t-5 border-l-5 border-t-blue border-l-transparent' />
        </span>
      ) : product.visual === 'board' ? (
        <span className={display + ' relative z-1 grid aspect-square w-1/2 place-content-center border border-aqua text-center text-zip leading-display text-aqua -rotate-7'} aria-hidden='true'>
          FRAME<br />LAB
        </span>
      ) : (
        <span className={label + ' relative z-1 grid aspect-square w-1/2 place-content-center border-12 border-blue bg-aqua text-center text-small leading-file text-ink rotate-9'} aria-hidden='true'>
          12<br />SENSORS
        </span>
      )}
    </div>
  );
}

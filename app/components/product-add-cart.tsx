'use client';

import { ShoppingCart } from 'lucide-react';
import { Product } from '../interfaces/store';
import { useBagStore } from '../stores/use-bag-store';
import { label } from './ui';
import { useRouter } from 'next/navigation';

function ProductAddCart({ product }: { product: Product }) {
  const addItem = useBagStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
    router.push('/carrito');
  };

  return (
    <button
      className={
        label +
        ' inline-flex cursor-pointer items-center justify-center gap-4 bg-blue px-5 py-4 text-white transition duration-200 hover:-translate-y-0.75 hover:bg-ink'
      }
      onClick={handleAddToCart}
      type='button'
    >
      AGREGAR AL CARRITO <ShoppingCart aria-hidden='true' className='size-4.5 shrink-0' strokeWidth={1.5} />
    </button>
  );
}

export default ProductAddCart;

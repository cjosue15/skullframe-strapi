'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Product } from '../interfaces/store';

export type BagItem = Pick<Product, 'slug' | 'title' | 'price' | 'type' | 'category' | 'cover'> & {
  quantity: number;
};

type BagStore = {
  items: BagItem[];
  addItem: (product: Product) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
};

export const useBagStore = create<BagStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.slug === product.slug);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                slug: product.slug,
                title: product.title,
                price: product.price,
                type: product.type,
                category: product.category,
                cover: product.cover,
                quantity: 1,
              },
            ],
          };
        });
      },
      updateQuantity: (slug, quantity) => {
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) => (item.slug === slug ? { ...item, quantity } : item))
              : state.items.filter((item) => item.slug !== slug),
        }));
      },
      removeItem: (slug) => {
        set((state) => ({ items: state.items.filter((item) => item.slug !== slug) }));
      },
    }),
    {
      name: 'skullframe-bag',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

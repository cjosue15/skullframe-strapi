'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Product } from '../interfaces/store';

export type BagItem = Pick<Product, 'id' | 'slug' | 'title' | 'price' | 'type' | 'category' | 'cover'> & {
  quantity: number;
};

type BagStore = {
  items: BagItem[];
  addItem: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
};

export const useBagStore = create<BagStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
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
                id: product.id,
                cover: product.cover,
                quantity: 1,
              },
            ],
          };
        });
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
              : state.items.filter((item) => item.id !== id),
        }));
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
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

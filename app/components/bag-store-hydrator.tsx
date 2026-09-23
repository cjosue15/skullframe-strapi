'use client';

import { useEffect } from 'react';
import { useBagStore } from '../stores/use-bag-store';

export function BagStoreHydrator() {
  useEffect(() => {
    void useBagStore.persist.rehydrate();
  }, []);

  return null;
}

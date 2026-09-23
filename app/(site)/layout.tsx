import type { ReactNode } from 'react';
import { BagStoreHydrator } from '../components/bag-store-hydrator';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-paper font-body text-ink'>
      <BagStoreHydrator />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

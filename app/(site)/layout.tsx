import type { ReactNode } from 'react';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-paper font-body text-ink'>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

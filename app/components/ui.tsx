export const label = 'font-body text-mini font-semibold tracking-label';
export const display = 'font-display font-black uppercase tracking-brand';
export const displayItalic = 'font-display text-display-italic font-normal normal-case italic tracking-display-italic';
export const kicker = label + ' flex items-center gap-2 text-muted tracking-kicker';
export const textLink =
  label +
  ' inline-flex items-center gap-5 border-b border-ink pb-2 transition-colors hover:border-blue hover:text-blue';

export function Arrow() {
  return <ArrowUpRight aria-hidden='true' className='size-4.5 shrink-0' strokeWidth={1.5} />;
}
import { ArrowUpRight } from 'lucide-react';

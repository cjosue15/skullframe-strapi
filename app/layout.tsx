import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skullframe — Tecnología para mentes inquietas',
  description: 'Drones, electrónica y recursos digitales para crear sin límites.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='es'>
      <body>{children}</body>
      <script src='https://js.culqi.com/checkout-js' async></script>
    </html>
  );
}

import { AboutSection } from '../components/about-section';
import { Hero } from '../components/hero';
import { ProductsSection } from '../components/products-section';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductsSection />
      <AboutSection />
    </main>
  );
}

import { AboutSection } from '../components/about-section';
import { Hero } from '../components/hero';
import { ProductsSection } from '../components/products-section';
import { getProductSection } from '../lib/get-products-section';

export default async function Home() {
  const products = await getProductSection();

  return (
    <main>
      <Hero />
      <ProductsSection products={products} />
      <AboutSection />
    </main>
  );
}

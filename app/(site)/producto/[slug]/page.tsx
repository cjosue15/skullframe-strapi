import {
  getProduct,
  // getProductSlugs
} from '@/app/lib/get-product';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '../../../components/product-detail';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// export async function generateStaticParams() {
//   const slugs = await getProductSlugs();

//   return slugs.map((slug) => ({ slug }));
// }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product ? product.title + ' — Skullframe' : 'Producto — Skullframe',
    description: product?.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}

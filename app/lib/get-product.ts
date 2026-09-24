import { Product, ProductStrapiResponse } from '../interfaces/store';
import { query } from './strapi';

// type ProductSlugsResponse = {
//   data: { slug: string }[];
//   meta: {
//     pagination: {
//       pageCount: number;
//     };
//   };
// };

// const productSlugsPageSize = 100;

// async function getProductSlugsPage(page: number): Promise<ProductSlugsResponse> {
//   return query<ProductSlugsResponse>(
//     `productos?status=published&fields[0]=slug&pagination[page]=${page}&pagination[pageSize]=${productSlugsPageSize}`,
//   );
// }

// export async function getProductSlugs(): Promise<string[]> {
//   const firstPage = await getProductSlugsPage(1);
//   const remainingPages = await Promise.all(
//     Array.from({ length: firstPage.meta.pagination.pageCount - 1 }, (_, index) => getProductSlugsPage(index + 2)),
//   );

//   return [firstPage, ...remainingPages].flatMap((page) => page.data.map((product) => product.slug));
// }

export async function getProduct(slug: string): Promise<Product | null> {
  const url = `productos?status=published&filters[slug][$eq]=${slug}&pagination[pageSize]=1&populate[images][fields][0]=url&populate[cover][fields][0]=url&populate[category][fields][0]=name`;

  const { data } = await query<{ data: ProductStrapiResponse[] }>(url);

  if (!data.length) {
    return null;
  }

  const rawProduct = data[0];

  return {
    id: rawProduct.id,
    slug: rawProduct.slug,
    title: rawProduct.title,
    description: rawProduct.description,
    price: rawProduct.price,
    images: rawProduct.images.map((img) => `${process.env.STRAPI_HOST}${img.url}`),
    shortDescription: rawProduct.shortDescription,
    type: rawProduct.type,
    category: rawProduct.category.name.toUpperCase(),
    cover: `${process.env.STRAPI_HOST}${rawProduct.cover.url}`,
    stock: rawProduct.stock,
  };
}

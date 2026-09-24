import { Product, ProductStrapiResponse } from '../interfaces/store';
import { query } from './strapi';

const { STRAPI_HOST } = process.env;

export async function getProductSection(): Promise<Product[]> {
  const url =
    'productos?status=published&sort=publishedAt:desc&pagination[pageSize]=3&fields[0]=title&fields[1]=price&fields[2]=shortDescription&fields[3]=type&fields[4]=slug&fields[5]=stock&populate[category][fields][0]=name&populate[images][fields][0]=url&populate[cover][fields][0]=url';

  const { data } = await query<{ data: ProductStrapiResponse[] }>(url);

  return data.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: null,
    price: item.price,
    images: item.images.map((img) => `${STRAPI_HOST}${img.url}`),
    shortDescription: item.shortDescription,
    type: item.type,
    category: item.category.name.toUpperCase(),
    cover: `${STRAPI_HOST}${item.cover.url}`,
    stock: item.stock,
  }));
}

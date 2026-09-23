import { Product, ProductStrapiResponse } from '../interfaces/store';
import { query } from './strapi';

const { STRAPI_HOST } = process.env;

export async function getStoreInfo(): Promise<Product[]> {
  const url =
    'productos?fields[0]=title&fields[1]=slug&fields[2]=price&fields[3]=description&fields[4]=shortDescription&fields[5]=type&populate[category][fields][0]=name&populate[images][fields][0]=url&populate[cover][fields][0]=url';

  const { data } = await query<{ data: ProductStrapiResponse[] }>(url);

  return data.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    price: item.price,
    image: item.images.map((img) => `${STRAPI_HOST}${img.url}`),
    shortDescription: item.shortDescription,
    type: item.type,
    category: item.category.name.toUpperCase(),
    cover: `${STRAPI_HOST}${item.cover.url}`,
  }));
}

import { Product, ProductPagination, ProductStrapiResponse } from '../interfaces/store';
import { query } from './strapi';

const { STRAPI_HOST } = process.env;

interface StoreParams {
  pageSize: number;
  page: number;
}

export async function getStoreInfo({
  pageSize,
  page,
}: StoreParams): Promise<{ products: Product[]; pagination: ProductPagination }> {
  let url =
    'productos?fields[0]=title&fields[1]=slug&fields[2]=price&fields[3]=description&fields[4]=shortDescription&fields[5]=type&fields[6]=stock&populate[category][fields][0]=name&populate[images][fields][0]=url&populate[cover][fields][0]=url';

  if (page) url += `&pagination[page]=${page}`;
  if (pageSize) url += `&pagination[pageSize]=${pageSize}`;

  const { data, meta } = await query<{
    data: ProductStrapiResponse[];
    meta: { pagination: ProductPagination };
  }>(url);

  const products = data.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    price: item.price,
    images: item.images.map((img) => `${STRAPI_HOST}${img.url}`),
    shortDescription: item.shortDescription,
    type: item.type,
    category: item.category.name.toUpperCase(),
    cover: `${STRAPI_HOST}${item.cover.url}`,
    stock: item.stock,
  }));

  return { products, pagination: meta.pagination };
}

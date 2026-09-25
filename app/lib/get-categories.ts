import { Category, CategoryResponse } from '../interfaces/category';
import { query } from './strapi';

export async function getCategories(): Promise<Category[]> {
  const url = 'categories?fields[0]=name&fields[1]=description&fields[2]=slug';

  const { data } = await query<{ data: CategoryResponse[] }>(url);

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
  }));
}

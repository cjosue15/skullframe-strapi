import { Category, CategoryResponse } from '../interfaces/category';
import { query } from './strapi';

export async function getCategories(): Promise<Category[]> {
  const url = 'categories?fields[0]=name&fields[1]=description';

  const { data } = await query<{ data: CategoryResponse[] }>(url);

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }));
}

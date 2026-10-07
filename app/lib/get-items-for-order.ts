import { ProductItem, ProductStrapiResponse } from '../interfaces/store';
import { queryV2 } from './strapi';

const PRODUCT_BATCH_SIZE = 25;

export const getItemsForOrder = async (
  items: ProductItem[],
): Promise<[Error | null, null | ProductStrapiResponse[]]> => {
  try {
    const ids = [...new Set(items.map((item) => item.id))];

    if (ids.length === 0) {
      return [new Error('El carrito está vacío.'), null];
    }

    const products: ProductStrapiResponse[] = [];

    // Keep each batch within Strapi's pagination and filter array limits.
    for (let offset = 0; offset < ids.length; offset += PRODUCT_BATCH_SIZE) {
      const batchIds = ids.slice(offset, offset + PRODUCT_BATCH_SIZE);
      const params = new URLSearchParams(
        'fields[0]=id&fields[1]=title&fields[2]=price&fields[3]=slug&fields[4]=description&fields[5]=shortDescription&fields[6]=type&fields[7]=stock&populate[images][fields][0]=url&populate[cover][fields][0]=url',
      );

      batchIds.forEach((id, index) => params.set(`filters[id][$in][${index}]`, id.toString()));
      params.set('pagination[page]', '1');
      params.set('pagination[pageSize]', batchIds.length.toString());

      const [error, response] = await queryV2<{ data: ProductStrapiResponse[] }>(`productos?${params.toString()}`);

      if (error) {
        return [error, null];
      }

      const returnedIds = new Set(response.data.map((product) => product.id));

      if (response.data.length !== batchIds.length || !batchIds.every((id) => returnedIds.has(id))) {
        return [new Error('Uno o más productos del carrito ya no están disponibles. Revisa tu carrito.'), null];
      }

      products.push(...response.data);
    }

    return [null, products];
  } catch {
    return [new Error('Error fetching items for order'), null];
  }
};

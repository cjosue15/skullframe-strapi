import { ProductItem, ProductStrapiResponse } from '../interfaces/store';
import { queryV2 } from './strapi';

export const getItemsForOrder = async (
  items: ProductItem[],
): Promise<[Error | null, null | ProductStrapiResponse[]]> => {
  try {
    const ids = items.map((item) => item.id);

    const [error, response] = await queryV2<{ data: ProductStrapiResponse[] }>(
      `productos?filters[id][$in]=${ids.join(',')}&fields[0]=id&fields[1]=title&fields[2]=price&fields[3]=slug&fields[4]=description&fields[5]=shortDescription&fields[6]=type&fields[7]=stock&populate[images][fields][0]=url&populate[cover][fields][0]=url`,
    );

    if (error) {
      return [error, null];
    }

    return [null, response.data];
  } catch {
    return [new Error('Error fetching items for order'), null];
  }
};

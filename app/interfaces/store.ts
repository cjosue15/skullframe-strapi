import type { BlocksContent } from '@strapi/blocks-react-renderer';

export type ProductDescription = BlocksContent | null;
export interface Product {
  id: number;
  slug: string;
  title: string;
  description: ProductDescription;
  price: number;
  images: string[];
  shortDescription: string;
  type: 'FISICO' | 'DIGITAL';
  category: string;
  cover: string;
  stock: number;
}

export interface ProductStrapiResponse {
  id: number;
  title: string;
  price: number;
  slug: string;
  description: ProductDescription;
  images: { url: string }[];
  shortDescription: string;
  type: 'FISICO' | 'DIGITAL';
  category: {
    name: string;
  };
  cover: {
    url: string;
  };
  stock: number;
}

export interface ProductPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

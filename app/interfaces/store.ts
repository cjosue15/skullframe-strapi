export interface Product {
  id: number;
  slug: string;
  title: string;
  description: unknown[];
  price: number;
  image: string[];
  shortDescription: string;
  type: 'FISICO' | 'DIGITAL';
  category: string;
  cover: string;
}

export interface ProductStrapiResponse {
  id: number;
  title: string;
  price: number;
  slug: string;
  description: unknown[];
  images: { url: string }[];
  shortDescription: string;
  type: 'FISICO' | 'DIGITAL';
  category: {
    name: string;
  };
  cover: {
    url: string;
  };
}

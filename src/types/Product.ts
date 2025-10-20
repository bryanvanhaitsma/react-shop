export type ApiSource = 'fakestore' | 'dummyjson' | 'platzi';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  source: ApiSource;
  stock?: number;
  brand?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  source?: ApiSource;
}

export type ApiProduct = Record<string, unknown>;
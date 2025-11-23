export type ApiSource = 'fakestore' | 'dummyjson' | 'platzi';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  rating?: {
    rate: number;
    count: number;
  };
  source: ApiSource;
  stock?: number;
  brand?: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  source?: ApiSource;
  sort?: SortOption;
  // Advanced filters
  priceRange?: [number, number];
  categories?: string[];
  minRating?: number;
  inStockOnly?: boolean;
}

export type ApiProduct = Record<string, unknown>;
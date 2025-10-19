import { fakeStoreApi } from './fakeStoreApi';
import { dummyJsonApi } from './dummyJsonApi';
import { Product, ApiSource } from '@/types/Product';

// Unified API service that aggregates all sources
export const apiService = {
  // Get products from all sources
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const [fakeStoreProducts, dummyJsonProducts] = await Promise.all([
        fakeStoreApi.getAllProducts(),
        dummyJsonApi.getAllProducts(20), // Limit to 20 for performance
      ]);

      return [...fakeStoreProducts, ...dummyJsonProducts];
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  },

  // Get products from specific source
  getProductsBySource: async (source: ApiSource): Promise<Product[]> => {
    try {
      switch (source) {
        case 'fakestore':
          return await fakeStoreApi.getAllProducts();
        case 'dummyjson':
          return await dummyJsonApi.getAllProducts();
        case 'platzi':
          return []; // Add Platzi API later
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error fetching products from ${source}:`, error);
      return [];
    }
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      if (id.startsWith('fakestore-')) {
        return await fakeStoreApi.getProduct(id);
      } else if (id.startsWith('dummyjson-')) {
        return await dummyJsonApi.getProduct(id);
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Search across all sources
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      // DummyJSON has search API
      const dummyResults = await dummyJsonApi.searchProducts(query);

      // FakeStore doesn't have search, so we fetch all and filter
      const fakeStoreProducts = await fakeStoreApi.getAllProducts();
      const fakeStoreResults = fakeStoreProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );

      return [...dummyResults, ...fakeStoreResults];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get all unique categories from all sources
  getAllCategories: async (): Promise<string[]> => {
    try {
      const [fakeStoreCategories, dummyJsonCategories] = await Promise.all([
        fakeStoreApi.getCategories(),
        dummyJsonApi.getCategories(),
      ]);

      // Combine and remove duplicates
      const allCategories = [...fakeStoreCategories, ...dummyJsonCategories];
      return Array.from(new Set(allCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};
import { fakeStoreApi } from './fakeStoreApi';
import { dummyJsonApi } from './dummyJsonApi';
import { platziApi } from './platziApi';
import { Product, ApiSource } from '@/types/Product';

// Unified API service that aggregates all sources
export const apiService = {

  // Get products from all sources
  getAllProducts: async (limit: number = 30, skip: number = 0): Promise<Product[]> => {
    try {
      const [fakeStoreProducts, dummyJsonProducts, platziProducts] = await Promise.all([
        fakeStoreApi.getAllProducts(),
        dummyJsonApi.getAllProducts(limit, skip), // Limit to 20 for performance
        platziApi.getAllProducts(20),  
      ]);

      return [...fakeStoreProducts, ...dummyJsonProducts, ...platziProducts];
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
          return await platziApi.getAllProducts();
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
      } else if (id.startsWith('platzi-')) {
        return await platziApi.getProduct(id);
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
      const [dummyResults, fakeStoreResults, platziResults] = await Promise.all([
        dummyJsonApi.searchProducts(query),
        // FakeStore doesn't have search, so we fetch all and filter
        fakeStoreApi.getAllProducts().then(products =>
          products.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase())
          )
        ),
        platziApi.searchProducts(query),
      ]);

      return [...dummyResults, ...fakeStoreResults, ...platziResults];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get all unique categories from all sources
  getAllCategories: async (): Promise<string[]> => {
    try {
      const [fakeStoreCategories, dummyJsonCategories, platziCategories] = await Promise.all([
        fakeStoreApi.getCategories(),
        dummyJsonApi.getCategories(),
        platziApi.getCategoryNames(),
      ]);

      // Combine and remove duplicates
      const allCategories = [...fakeStoreCategories, ...dummyJsonCategories, ...platziCategories];
      return Array.from(new Set(allCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};
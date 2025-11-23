import axios from 'axios';
import { Product } from '@/types/Product';

const BASE_URL = 'https://dummyjson.com';

// Normalize DummyJSON API response to our Product type
const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: `dummyjson-${apiProduct.id}`,
    title: apiProduct.title,
    price: apiProduct.price,
    description: apiProduct.description,
    category: apiProduct.category,
    images: apiProduct.images || (apiProduct.thumbnail ? [apiProduct.thumbnail] : []),
    rating: {
      rate: apiProduct.rating || 0,
      count: apiProduct.reviews?.length || 0,
    },
    source: 'dummyjson',
    stock: apiProduct.stock,
    brand: apiProduct.brand,
  };
};


interface DummyJsonCategory {
  slug: string;
  name: string;
  url: string;
}


export const dummyJsonApi = {
  // Get all products
  getAllProducts: async (limit: number = 30): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products?limit=${limit}`);
      return response.data.products.map(normalizeProduct);
    } catch (error) {
      console.error('DummyJSON API Error:', error);
      return [];
    }
  },

  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const numericId = id.replace('dummyjson-', '');
      const response = await axios.get(`${BASE_URL}/products/${numericId}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error('DummyJSON API Error:', error);
      return null;
    }
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/search?q=${query}`);
      return response.data.products.map(normalizeProduct);
    } catch (error) {
      console.error('DummyJSON API Error:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/category/${category}`);
      return response.data.products.map(normalizeProduct);
    } catch (error) {
      console.error('DummyJSON API Error:', error);
      return [];
    }
  },

  // Get all categories
  getCategories: async (): Promise<DummyJsonCategory[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('DummyJSON API Error:', error);
      return [];
    }
  },
};
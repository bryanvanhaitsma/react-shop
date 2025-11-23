import axios from 'axios';
import { Product } from '@/types/Product';

const BASE_URL = 'https://fakestoreapi.com';

// Normalize FakeStore API response to our Product type
const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: `fakestore-${apiProduct.id}`,
    title: apiProduct.title,
    price: apiProduct.price,
    description: apiProduct.description,
    category: apiProduct.category,
    images: apiProduct.image ? [apiProduct.image] : [],
    rating: apiProduct.rating,
    source: 'fakestore',
  };
};

export const fakeStoreApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error('FakeStore API Error:', error);
      return [];
    }
  },

  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const numericId = id.replace('fakestore-', '');
      const response = await axios.get(`${BASE_URL}/products/${numericId}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error('FakeStore API Error:', error);
      return null;
    }
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/category/${category}`);
      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error('FakeStore API Error:', error);
      return [];
    }
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('FakeStore API Error:', error);
      return [];
    }
  },
};
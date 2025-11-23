import axios from 'axios';
import { Product } from '@/types/Product';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

// Normalize Platzi API response to our Product type
const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: `platzi-${apiProduct.id}`,
    title: apiProduct.title,
    price: apiProduct.price,
    description: apiProduct.description,
    category: apiProduct.category?.name || 'Uncategorized',
    images: apiProduct.images || (apiProduct.category?.image ? [apiProduct.category.image] : []),
    rating: {
      rate: 4.0, // Platzi API doesn't provide ratings, so we use a default
      count: Math.floor(Math.random() * 100) + 10, // Random count for demo
    },
    source: 'platzi',
  };
};


interface PlatziCategory {
  id: number; 
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}


export const platziApi = {
  // Get all products
  getAllProducts: async (limit: number = 20): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products?offset=0&limit=${limit}`);
      console.log(response.data);
      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error('Platzi API Error:', error);
      return [];
    }
  },

  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const numericId = id.replace('platzi-', '');
      const response = await axios.get(`${BASE_URL}/products/${numericId}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error('Platzi API Error:', error);
      return null;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/${categoryId}/products`);
      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error('Platzi API Error:', error);
      return [];
    }
  },

  // Get all categories
  getCategories: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Platzi API Error:', error);
      return [];
    }
  },

  // Get category names only
  getCategoryNames: async (): Promise<PlatziCategory[]> => {
    try {
      const categories = await platziApi.getCategories();
      return categories.map(cat => cat.name);
    } catch (error) {
      console.error('Platzi API Error:', error);
      return [];
    }
  },

  // Search products by title
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products?title=${query}`);
      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error('Platzi API Error:', error);
      return [];
    }
  },
};
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { platziApi } from '@/services/platziApi';
import axios from 'axios';
import { mockPlatziApiProducts, mockPlatziApiCategories } from './mockPlatziApiData';

// Mock axios
vi.mock('axios');

describe('platziApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(platziApi).toBeDefined();
  });

  it('should fetch a product by ID from Platzi API', async () => {
    // Mock the axios.get response
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPlatziApiProducts[0],
    });

    const product = await platziApi.getProduct('1');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('platzi-1');
    expect(product?.title).toBe('Majestic Mountain Graphic T-Shirt');
    expect(product?.price).toBe(44);
    expect(product?.source).toBe('platzi');
    
    // Verify axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products/1');
  });

  it('should handle API errors gracefully', async () => {
    // Mock axios to throw an error
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

    const product = await platziApi.getProduct('1');
    
    // Should return null when API fails
    expect(product).toBeNull();
  });

  it('should normalize product data correctly', async () => {
    // Mock product with missing/incomplete data
    const incompleteProductData = {
      id: 2,
      title: 'Test Product',
      price: 50,
      description: 'Test',
      // No category
      // No images
    };

    vi.mocked(axios.get).mockResolvedValueOnce({
      data: incompleteProductData,
    });

    const product = await platziApi.getProduct('2');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('platzi-2');
    expect(product?.source).toBe('platzi');
    expect(product?.category).toBe('Uncategorized'); // Should default to Uncategorized
    expect(product?.images).toEqual([]); // Should handle missing images
    expect(product?.rating?.rate).toBe(4.0); // Platzi uses default rating
  });

  it('should fetch products from Platzi API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPlatziApiProducts,
    });
    
    const products = await platziApi.getAllProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify the correct URL was called with default limit
    expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products?offset=0&limit=20');
  });

  it('should fetch products with custom limit', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPlatziApiProducts,
    });
    
    await platziApi.getAllProducts(10);
    
    // Verify the correct URL was called with custom limit
    expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products?offset=0&limit=10');
  });

  it('should get all the product categories from Platzi API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPlatziApiCategories,
    });
    
    const categories = await platziApi.getCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('id');
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('slug');
  });

  it('should get all products within a category when given a category ID', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPlatziApiProducts,
    });
    
    const products = await platziApi.getProductsByCategory(1);
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify the correct URL was called
    expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/categories/1/products');
  });

  it('should search products by title query string', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: [mockPlatziApiProducts[0]],
    });

    const products = await platziApi.searchProducts('shirt');
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify the correct URL was called
    expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products?title=shirt');
  });

  it('should handle empty search results', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: [],
    });

    const products = await platziApi.searchProducts('nonexistent');
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(0);
  });

  it('should return empty array when getAllProducts fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const products = await platziApi.getAllProducts();
    expect(products).toEqual([]);
  });

  it('should return empty array when getCategories fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const categories = await platziApi.getCategories();
    expect(categories).toEqual([]);
  });

  it('should return empty array when getProductsByCategory fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const products = await platziApi.getProductsByCategory(999);
    expect(products).toEqual([]);
  });

  it('should return empty array when searchProducts fails', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    const products = await platziApi.searchProducts('test');
    expect(products).toEqual([]);
  });
});

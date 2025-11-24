import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dummyJsonApi } from '@/services/dummyJsonApi';
import axios from 'axios';
import { mockDummyJsonApiProducts, mockDummyJsonApiCategories } from './mockDummyJsonApiData';

// Mock axios
vi.mock('axios');



describe('dummyJsonApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });


  it('should be defined', () => {
    expect(dummyJsonApi).toBeDefined();
  });


  it('should fetch a product by ID from DummyJSON API', async () => {
    // Mock the axios.get response
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockDummyJsonApiProducts[0],
    });

    const product = await dummyJsonApi.getProduct('1');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('dummyjson-1');
    expect(product?.title).toBe('Essence Mascara Lash Princess');
    expect(product?.price).toBe(9.99);
    
    // Verify axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products/1');
  });


  it('should handle API errors gracefully', async () => {
    // Mock axios to throw an error
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

    const product = await dummyJsonApi.getProduct('1');
    
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
      category: 'electronics',
      // No thumbnail or images
      rating: 3.5,
      // No stock
      // No brand
    };

    vi.mocked(axios.get).mockResolvedValueOnce({
      data: incompleteProductData,
    });

    const product = await dummyJsonApi.getProduct('2');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('dummyjson-2');
    expect(product?.source).toBe('dummyjson');
    expect(product?.images).toEqual([]); // Should handle missing images
    expect(product?.rating?.rate).toBe(3.5);
    expect(product?.rating?.count).toBe(0); // Should default to 0
  });


  it('should fetch products from DummyJSON API', async () => {
     vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        products: mockDummyJsonApiProducts,
      }
    });
    const products = await dummyJsonApi.getAllProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });


  it('should get all the product categories from DummyJSON API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockDummyJsonApiCategories,
    });
    const categories = await dummyJsonApi.getCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });


  it('should get all products within a category when given a product category string', async () => {
     vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        products: mockDummyJsonApiProducts,
      }
    });
    const products = await dummyJsonApi.getProductsByCategory('beauty');
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });


  // it('should search products by query string', async () => {
  //   vi.mocked(axios.get).mockResolvedValueOnce({
  //     data: {
  //       products: [mockProductData],
  //     },
  //   });

  //   const products = await dummyJsonApi.searchProducts('apple');
  //   expect(products).toBeDefined();
  //   expect(Array.isArray(products)).toBe(true);
  //   expect(products.length).toBeGreaterThan(0);
  // });

});

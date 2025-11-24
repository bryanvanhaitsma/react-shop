import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fakeStoreApi } from '@/services/fakeStoreApi';
import axios from 'axios';
import { mockFakeStoreApiProducts, mockFakeStoreApiCategories } from './mockFakeStoreApiData';



vi.mock('axios');


describe('fakeStoreApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(fakeStoreApi).toBeDefined();
  });

  it('should fetch a product by ID from FakeStore API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockFakeStoreApiProducts[0],
    });

    const product = await fakeStoreApi.getProduct('1');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('fakestore-1');
    expect(product?.title).toBe('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
    expect(product?.price).toBe(109.95);
    
    expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

    const product = await fakeStoreApi.getProduct('1');
    
    expect(product).toBeNull();
  });

  it('should normalize product data correctly', async () => {
    const incompleteProductData = {
      id: 2,
      title: 'Test Product',
      price: 50,
      description: 'Test',
      category: 'electronics',
      // No image
      rating: {
        rate: 4.5,
        count: 100,
      },
    };

    vi.mocked(axios.get).mockResolvedValueOnce({
      data: incompleteProductData,
    });

    const product = await fakeStoreApi.getProduct('2');
    
    expect(product).toBeDefined();
    expect(product?.id).toBe('fakestore-2');
    expect(product?.images).toEqual([]); // No image provided
    expect(product?.rating?.rate).toBe(4.5);
    expect(product?.rating?.count).toBe(100);
  });

  it('should fetch all categories', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockFakeStoreApiCategories,
    });

    const categories = await fakeStoreApi.getCategories();
    
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    
    expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
  });

  it('should fetch products by category', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockFakeStoreApiProducts.slice(0, 4),
    });

    const products = await fakeStoreApi.getProductsByCategory('mens-clothing');
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(4);
    
    expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/category/mens-clothing'); 

  });


});

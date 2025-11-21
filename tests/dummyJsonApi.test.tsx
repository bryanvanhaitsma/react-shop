import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { dummyJsonApi } from '@/services/dummyJsonApi';
import { useContext } from 'react';



describe('dummyJsonApi', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test if necessary
  });

  it('should fetch products from DummyJSON API', async () => {
    const products = await dummyJsonApi.getAllProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get all the product categories from DummyJSON API', async () => {
    const categories = await dummyJsonApi.getCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should get all products within a category when given a product category string', async () => {
    const products = await dummyJsonApi.getProductsByCategory('smartphones');
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should search products by query string', async () => {
    const products = await dummyJsonApi.searchProducts('phone');
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

});

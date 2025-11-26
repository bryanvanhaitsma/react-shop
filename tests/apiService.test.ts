import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '@/services/apiService';
import { fakeStoreApi } from '@/services/fakeStoreApi';
import { dummyJsonApi } from '@/services/dummyJsonApi';
import { platziApi } from '@/services/platziApi';

vi.mock('@/services/fakeStoreApi');
vi.mock('@/services/dummyJsonApi');
vi.mock('@/services/platziApi');

const mockedFake = vi.mocked(fakeStoreApi);
const mockedDummy = vi.mocked(dummyJsonApi);
const mockedPlatzi = vi.mocked(platziApi);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('apiService category aggregation', () => {
  it('getAllCategories returns unique, normalized names', async () => {
    mockedFake.getCategories.mockResolvedValueOnce(['electronics', 'jewelery', "men's clothing"]);
    mockedDummy.getCategories.mockResolvedValueOnce([
      { slug: 'smartphones', name: 'Smartphones', url: '/c/smartphones' },
      { slug: 'laptops', name: 'Laptops', url: '/c/laptops' },
    ] as unknown as { slug: string; name: string; url: string }[]);
    mockedPlatzi.getCategories.mockResolvedValueOnce([
      { id: 1, name: 'Shoes', slug: 'shoes', image: 'http://img/shoes.png' },
      { id: 2, name: 'Furniture', slug: 'furniture', image: 'http://img/furniture.png' },
    ] as unknown as { id: number; name: string; slug: string; image: string }[]);

    const names = await apiService.getAllCategories();
    expect(names).toEqual(
      expect.arrayContaining([
        'electronics',
        'jewelery',
        "men's clothing",
        'Smartphones',
        'Laptops',
        'Shoes',
        'Furniture',
      ])
    );
    // Ensure de-dup and all are strings
    expect(new Set(names).size).toBe(names.length);
    expect(names.every((n) => typeof n === 'string')).toBe(true);
  });

  it('getAllProductsByCategory aggregates across sources by name', async () => {
    const cat = 'electronics';
    mockedFake.getProductsByCategory.mockResolvedValueOnce([
      { id: 'fakestore-1', title: 'FS Cam', price: 100, description: '', category: cat, images: ['fs1'], source: 'fakestore' },
    ] as unknown as Array<{
      id: string; title: string; price: number; description: string; category: string; images: string[]; source: 'fakestore';
    }>);
    mockedDummy.getProductsByCategory.mockResolvedValueOnce([
      { id: 'dummyjson-1', title: 'DJ Phone', price: 200, description: '', category: cat, images: ['dj1'], source: 'dummyjson' },
    ] as unknown as Array<{
      id: string; title: string; price: number; description: string; category: string; images: string[]; source: 'dummyjson';
    }>);

    mockedPlatzi.getCategories.mockResolvedValueOnce([
      { id: 42, name: 'Electronics', slug: 'electronics', image: '' },
    ] as unknown as { id: number; name: string; slug: string; image: string }[]);
    mockedPlatzi.getProductsByCategory.mockResolvedValueOnce([
      { id: 'platzi-1', title: 'P Tablet', price: 300, description: '', category: 'Electronics', images: ['p1'], source: 'platzi' },
    ] as unknown as Array<{
      id: string; title: string; price: number; description: string; category: string; images: string[]; source: 'platzi';
    }>);

    const products = await apiService.getAllProductsByCategory(cat);
    expect(products).toHaveLength(3);
    expect(products.map((p) => p.source).sort()).toEqual(['dummyjson', 'fakestore', 'platzi'].sort());
  });
});

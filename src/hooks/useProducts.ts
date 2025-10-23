'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFilters, ApiSource } from '@/types/Product';
import { apiService } from '@/services/apiService';

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let fetchedProducts: Product[] = [];

        // Fetch based on filters
        if (filters?.source) {
          fetchedProducts = await apiService.getProductsBySource(filters.source);
        } else if (filters?.search) {
          fetchedProducts = await apiService.searchProducts(filters.search);
        } else {
          // Default: fetch from all configured sources
          fetchedProducts = await apiService.getAllProducts();
        }

        // Apply client-side filters
        let filtered = fetchedProducts;

        if (filters?.category) {
          filtered = filtered.filter(
            (product) => product.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }

        if (filters?.minPrice !== undefined) {
          filtered = filtered.filter((product) => product.price >= filters.minPrice!);
        }

        if (filters?.maxPrice !== undefined) {
          filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
        }

        // Apply sorting
        if (filters?.sort) {
          filtered = [...filtered].sort((a, b) => {
            switch (filters.sort) {
              case 'price-asc':
                return a.price - b.price;
              case 'price-desc':
                return b.price - a.price;
              case 'name-asc':
                return a.title.localeCompare(b.title);
              case 'name-desc':
                return b.title.localeCompare(a.title);
              default:
                return 0;
            }
          });
        }

        setProducts(filtered);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.source, filters?.search, filters?.category, filters?.minPrice, filters?.maxPrice, filters?.sort]);

  return { products, loading, error };
};
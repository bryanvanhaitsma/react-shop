'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import { ApiSource, SortOption, Product } from '@/types/Product';
import ApiSourceFilter from '@/components/ApiSourceFilter';
import ProductSort from '@/components/products/ProductSort';
import Link from 'next/link';
import HeaderSearch from '@/components/HeaderSearch';
import ProductCard from '@/components/products/ProductCard';


export default function HomePage() {
  const [selectedSource, setSelectedSource] = useState<ApiSource | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('price-desc');
  const { getItemCount } = useCart();
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400); // 400ms debounce
    return () => clearTimeout(t);
  }, [search]);

  // pass filters, sorting, and search to useProducts
  const { products, loading, error } = useProducts({
    source: selectedSource || undefined,
    sort: sortOption,
    search: debouncedSearch || undefined,
  });




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛍️ E-Commerce Aggregator
            </h1>     
            <ApiSourceFilter selectedSource={selectedSource} onSourceChange={setSelectedSource} />
            <HeaderSearch value={search} onChange={setSearch} />
            <div className="relative">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <ShoppingCart size={20} />
                <Link href="/cart">
                  <span className="font-semibold">Cart ({getItemCount()})</span>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {products.length} products from multiple stores
            </p>
            <ProductSort 
              value={sortOption}
              onChange={setSortOption}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>E-Commerce Aggregator - React Portfolio Project</p>
          <p className="text-sm text-gray-400 mt-2">
            Data from FakeStore API & DummyJSON
          </p>
        </div>
      </footer>
    </div>
  );
}
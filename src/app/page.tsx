'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ApiSource, SortOption } from '@/types/Product';
import ApiSourceFilter from '@/components/ApiSourceFilter';
import ProductSort from '@/components/products/ProductSort';
import HeaderSearch from '@/components/HeaderSearch';
import HeaderCartButton from '@/components/ui/HeaderCartButton';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/context/WishListContext';
import Link from 'next/link';
import { Heart } from 'lucide-react';


export default function HomePage() {
  const [selectedSource, setSelectedSource] = useState<ApiSource | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('price-desc');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const { items } = useWishlist();

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
          <p className="">Loading products...</p>
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🛍️ E-Commerce Aggregator</h1>     
            <div className="relative flex flex-wrap gap-2">
              {items.length > 0 && (
                <Link 
                  href="/wish-list/"
                >
                  <button
                    className="flex gap-2 px-4 py-2 rounded-lg font-semibold transition text-white bg-gray-500"
                  ><Heart size={20} />Wishlist</button>
                </Link>
              )}
              <HeaderCartButton />
            </div>
          </div>
        </div>
      </header>
      <div className="bg-gray-100">
        <div id="utily-tools" className="container mx-auto flex items-center justify-between px-4 py-2">
          <HeaderSearch value={search} onChange={setSearch} />
          <ApiSourceFilter selectedSource={selectedSource} onSourceChange={setSelectedSource} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">
            All Products
          </h2>
          <div className="flex items-center justify-between">
            <p>
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
            <p className="text-xl">No products found</p>
          </div>
        )}
      </main>

    </div>
  );
}
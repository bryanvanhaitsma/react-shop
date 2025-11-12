'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ApiSource, SortOption, Product } from '@/types/Product';
import ApiSourceFilter from '@/components/ApiSourceFilter';
import ProductSort from '@/components/products/ProductSort';
import HeaderSearch from '@/components/HeaderSearch';
import ProductCard from '@/components/products/ProductCard';
import Header from '@/components/ui/Header';
import ProductFilters, { FilterValues } from '@/components/filters/ProductFilters';
import ActiveFilters from '@/components/filters/ActiveFilters';


export default function HomePage() {
  const [selectedSource, setSelectedSource] = useState<ApiSource | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('price-desc');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [1, 5000],
    categories: [],
    minRating: 0,
    inStockOnly: false,
  });

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
    priceRange: filters.priceRange,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    inStockOnly: filters.inStockOnly,
  });

  // Calculate available categories and price range from products
  const { availableCategories, categoryCounts, priceRange } = useMemo(() => {
    const categories = new Set<string>();
    const counts: Record<string, number> = {};
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product: Product) => {
      categories.add(product.category);
      counts[product.category] = (counts[product.category] || 0) + 1;
      if (product.price < minPrice) minPrice = product.price;
      if (product.price > maxPrice) maxPrice = product.price;
    });

    return {
      availableCategories: Array.from(categories).sort(),
      categoryCounts: counts,
      priceRange: [Math.floor(minPrice), Math.ceil(maxPrice)] as [number, number],
    };
  }, [products]);

  // Initialize price range filter when products load
  useEffect(() => {
    if (priceRange[0] !== Infinity && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      setFilters(prev => ({ ...prev, priceRange }));
    }
  }, [priceRange, filters.priceRange]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleRemoveCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category),
    }));
  };

  const handleRemoveRating = () => {
    setFilters(prev => ({ ...prev, minRating: 0 }));
  };

  const handleRemoveStock = () => {
    setFilters(prev => ({ ...prev, inStockOnly: false }));
  };

  const handleRemovePriceRange = () => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      priceRange,
      categories: [],
      minRating: 0,
      inStockOnly: false,
    });
  };
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
      <Header />
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

        {/* Main Layout: Filters + Products */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters (Desktop only) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              availableCategories={availableCategories}
              categoryCounts={categoryCounts}
              priceRange={priceRange}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              priceRange={priceRange}
              onRemoveCategory={handleRemoveCategory}
              onRemoveRating={handleRemoveRating}
              onRemoveStock={handleRemoveStock}
              onRemovePriceRange={handleRemovePriceRange}
              onClearAll={handleClearAllFilters}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-xl">No products found</p>
                <p className="text-gray-600 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
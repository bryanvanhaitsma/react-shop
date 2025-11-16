'use client';

import PriceRangeFilter from './PriceRangeFilter';
import CategoryFilter from './CategoryFilter';

export interface FilterValues {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterValues;
  availableCategories: string[];
  categoryCounts: Record<string, number>;
  priceRange: [number, number]; // min and max prices from all products
  onFilterChange: (filters: FilterValues) => void;
}

export default function ProductFilters({
  filters,
  availableCategories,
  categoryCounts,
  priceRange,
  onFilterChange,
}: ProductFiltersProps) {
  
  const handlePriceChange = (newRange: [number, number]) => {
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleCategoriesChange = (categories: string[]) => {
    onFilterChange({ ...filters, categories });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleStockToggle = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const handleClearAll = () => {
    onFilterChange({
      priceRange: priceRange,
      categories: [],
      minRating: 0,
      inStockOnly: false,
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1];

  return (
    <div className="rounded-lg p-6 space-y-6 filter--container">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <h2 className="text-lg font-bold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <PriceRangeFilter
        min={priceRange[0]}
        max={priceRange[1]}
        currentRange={filters.priceRange}
        onChange={handlePriceChange}
      />

      <div className="border-t pt-4" />

      {/* Categories */}
      <CategoryFilter
        categories={availableCategories}
        selectedCategories={filters.categories}
        productCounts={categoryCounts}
        onChange={handleCategoriesChange}
      />

      <div className="border-t pt-4" />

      {/* Rating Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide">Minimum Rating</h3>
        <div className="space-y-2 stars--filter">
          {[4, 3, 2, 1, 0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer p-2 rounded"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="flex items-center gap-1 text-sm">
                {rating > 0 ? (
                  <>
                    <span className="text-yellow-500">★</span>
                    {rating}+ stars
                  </>
                ) : (
                  'All ratings'
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4" />

      {/* Stock Filter */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleStockToggle}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

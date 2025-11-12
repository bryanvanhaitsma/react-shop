'use client';

import { X } from 'lucide-react';
import type { FilterValues } from './ProductFilters';

interface ActiveFiltersProps {
  filters: FilterValues;
  priceRange: [number, number]; // full range for comparison
  onRemoveCategory: (category: string) => void;
  onRemoveRating: () => void;
  onRemoveStock: () => void;
  onRemovePriceRange: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  priceRange,
  onRemoveCategory,
  onRemoveRating,
  onRemoveStock,
  onRemovePriceRange,
  onClearAll,
}: ActiveFiltersProps) {
  
  const hasFilters = 
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1];

  if (!hasFilters) {
    return null;
  }

  const isPriceRangeActive = 
    filters.priceRange[0] !== priceRange[0] || 
    filters.priceRange[1] !== priceRange[1];

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Price range chip */}
        {isPriceRangeActive && (
          <FilterChip
            label={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}
            onRemove={onRemovePriceRange}
          />
        )}

        {/* Category chips */}
        {filters.categories.map((category) => (
          <FilterChip
            key={category}
            label={category}
            onRemove={() => onRemoveCategory(category)}
          />
        ))}

        {/* Rating chip */}
        {filters.minRating > 0 && (
          <FilterChip
            label={`${filters.minRating}+ stars`}
            onRemove={onRemoveRating}
          />
        )}

        {/* Stock chip */}
        {filters.inStockOnly && (
          <FilterChip
            label="In Stock"
            onRemove={onRemoveStock}
          />
        )}
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
      <span className="capitalize">{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-blue-200 rounded-full p-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <X size={14} />
      </button>
    </span>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import PriceRangeSlider from '../ui/PriceRangeSlider';
import { Product } from '@/types/Product';


interface PriceRangeFilterProps {
  min: number;
  max: number;
  currentRange: [number, number];
  onChange: (range: [number, number]) => void;
  products: Product[];
}

export default function PriceRangeFilter({ min, max, currentRange, onChange, products }: PriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(currentRange);

  useEffect(() => {
    setLocalRange(currentRange);
  }, [currentRange]);

  // Calculate product count per price range bucket
  const priceDistribution = useMemo(() => {
    const buckets: Record<number, number> = {};
    const bucketSize = 100;
    
    // Initialize buckets
    for (let i = 0; i <= max; i += bucketSize) {
      buckets[i] = 0;
    }
    
    // Count products in each bucket
    products.forEach(product => {
      const bucketStart = Math.floor(product.price / bucketSize) * bucketSize;
      if (buckets[bucketStart] !== undefined) {
        buckets[bucketStart]++;
      }
    });
    
    // Find max count for scaling
    const maxCount = Math.max(...Object.values(buckets), 1);
    
    return { buckets, maxCount };
  }, [products, max]);

  const handleApply = () => {
    onChange(localRange);
  };

  const handleReset = () => {
    const resetRange: [number, number] = [min, max];
    setLocalRange(resetRange);
    onChange(resetRange);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wide">Price Range</h3>
      
      {/* Price distribution bar chart */}
      <div className="flex items-end justify-between gap-0.5 h-16 mb-2">
        {Array.from({ length: Math.floor(max / 100) + 1 }, (_, i) => i * 100).map((bucketStart) => {
          const count = priceDistribution.buckets[bucketStart] || 0;
          const heightPercent = (count / priceDistribution.maxCount) * 100;
          
          return (
            <div
              key={bucketStart}
              className="flex-1 bg-blue-200 rounded-t transition-all hover:bg-blue-300"
              style={{ height: `${heightPercent}%` }}
              title={`$${bucketStart}-$${bucketStart + 99}: ${count} products`}
            />
          );
        })}
      </div>
    
      <PriceRangeSlider
        min={min}
        max={max}
        step={100}
        defaultRange={[localRange[0], localRange[1]]}
        onChange={setLocalRange}
      />

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded text-sm btn--reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

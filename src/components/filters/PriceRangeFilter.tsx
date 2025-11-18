'use client';

import { useState, useEffect } from 'react';
import PriceRangeSlider from '../ui/PriceRangeSlider';


interface PriceRangeFilterProps {
  min: number;
  max: number;
  currentRange: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function PriceRangeFilter({ min, max, currentRange, onChange }: PriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(currentRange);

  useEffect(() => {
    setLocalRange(currentRange);
  }, [currentRange]);

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

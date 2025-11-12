'use client';

import { useState, useEffect } from 'react';

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

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin > 0 && newMin <= localRange[1]) {
      const newRange: [number, number] = [newMin, localRange[1]];
      setLocalRange(newRange);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= localRange[0] && newMax <= max) {
      const newRange: [number, number] = [localRange[0], newMax];
      setLocalRange(newRange);
    }
  };

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
      
      <div className="space-y-2">
        {/* Min slider */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Min: ${localRange[0]}</label>
          <input
            type="range"
            min={min}
            max={max}
            value={localRange[0]}
            onChange={handleMinChange}
            className="w-full accent-blue-600"
          />
        </div>
        
        {/* Max slider */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Max: ${localRange[1]}</label>
          <input
            type="range"
            min={min}
            max={max}
            value={localRange[1]}
            onChange={handleMaxChange}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Price inputs */}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={min}
          max={max}
          value={localRange[0]}
          onChange={handleMinChange}
          className="w-20 px-2 py-1 border rounded text-sm"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          min={min}
          max={max}
          value={localRange[1]}
          onChange={handleMaxChange}
          className="w-20 px-2 py-1 border rounded text-sm"
        />
      </div>

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
          className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

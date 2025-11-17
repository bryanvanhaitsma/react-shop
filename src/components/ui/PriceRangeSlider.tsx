// components/PriceRangeSlider.tsx
import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatPrice } from '@/utils/formatters'; 

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  defaultRange?: [number, number];
  onChange?: (range: [number, number]) => void;
  className?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step,
  defaultRange = [min, max],
  onChange,
  className = ''
}) => {
  const [range, setRange] = useState<[number, number]>(defaultRange);

  // Sync local state when defaultRange prop changes
  useEffect(() => {
    setRange(defaultRange);
  }, [defaultRange]);

  const handleChange = (values: number | number[]) => {
    // rc-slider can return a single value or an array
    if (Array.isArray(values) && values.length === 2) {
      const newRange: [number, number] = [values[0], values[1]];
      setRange(newRange);
      // Call onChange immediately when user drags the slider
      if (onChange) {
        onChange(newRange);
      }
    }
  };

  return (
    <div className={`price-range-slider ${className}`}>
      <div className="mb-6">
        <Slider
          range
          min={min}
          max={max}
          value={range}
          step={step}
          onChange={handleChange}
          allowCross={false}
          pushable={5} // Minimum distance between handles
          trackStyle={[{ backgroundColor: '#3B82F6' }]} // Blue track
          handleStyle={[
            { 
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F6'
            },
            {
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F6'
            }
          ]}
          railStyle={{ backgroundColor: '#E5E7EB' }}
        />
      </div>

      {/* Price display */}
      <div className="flex justify-between items-center">
        <div className="px-3 py-1 rounded-md price--filter">
          <span className="text-sm font-medium">{formatPrice(range[0])}</span>
        </div>
        <div className="text-gray-400 text-sm px-2">to</div>
        <div className="px-3 py-1 rounded-md price--filter">
          <span className="text-sm font-medium">{formatPrice(range[1])}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
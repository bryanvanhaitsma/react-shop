'use client';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  productCounts: Record<string, number>;
  onChange: (categories: string[]) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategories, 
  productCounts,
  onChange 
}: CategoryFilterProps) {
  
  const handleToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto category--filter">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center gap-2 cursor-pointer p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleToggle(category)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="flex-1 text-sm capitalize">{category}</span>
            <span className="text-xs text-gray-500">
              ({productCounts[category] || 0})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

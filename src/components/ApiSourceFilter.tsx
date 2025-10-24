'use client';

import { ApiSource } from '@/types/Product';

interface ApiSourceFilterProps {
  selectedSource: ApiSource | null;
  onSourceChange: (source: ApiSource | null) => void;
}

export default function ApiSourceFilter({ selectedSource, onSourceChange }: ApiSourceFilterProps) {
  const sources: { value: ApiSource | null; label: string; color: string }[] = [
    { value: null, label: 'All Sources', color: 'bg-gray-500' },
    { value: 'fakestore', label: 'FakeStore', color: 'bg-blue-500' },
    { value: 'dummyjson', label: 'DummyJSON', color: 'bg-green-500' },
    { value: 'platzi', label: 'Platzi', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <button
          key={source.label}
          onClick={() => onSourceChange(source.value)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedSource === source.value
              ? `${source.color} text-white shadow-lg`
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
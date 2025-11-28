import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  slug?: string;
  imageUrl?: string | null;
  count?: number;
}

export default function CategoryCard({ name, slug, imageUrl, count }: CategoryCardProps) {
  const href = `/categories/${encodeURIComponent(slug || name)}`;
  const fallback = '/category-fallback.jpg';

  return (
    <Link href={href.toLowerCase()} className="block group rounded-lg overflow-hidden category--card">
      <div className="relative h-40 w-full">
        {imageUrl ? 
          (<Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />)
        : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500 m-2">Image unavailable</p>
          </div>
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="font-medium capitalize">{name}</span>
        {typeof count === 'number' && count > 0 && (
          <span className="text-sm text-gray-600">({count})</span>
        )}
      </div>
    </Link>
  );
}

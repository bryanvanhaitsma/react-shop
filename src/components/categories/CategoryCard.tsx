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
    <Link href={href} className="block group rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={imageUrl || fallback}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="font-medium capitalize">{name}</span>
        {typeof count === 'number' && (
          <span className="text-sm text-gray-600">({count})</span>
        )}
      </div>
    </Link>
  );
}

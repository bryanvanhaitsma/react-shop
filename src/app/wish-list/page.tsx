'use client'

import { useWishlist } from '@/context/WishListContext';
import Link from 'next/link';
import Image from 'next/image';
import WishlistButton from '@/components/WishListButton';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <p className="text-gray-600 mb-8">You haven't saved any items to your wishlist yet.</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        
        <div className="flex space-x-4">
          <button 
            onClick={clearWishlist}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(product => (
          <div 
            key={product.id} 
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product image with link */}
            <Link href={`/product/${product.slug || product.id}`}>
              <div className="relative h-48 bg-gray-100">
                {product.image ? (
                  <Image 
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image available
                  </div>
                )}
              </div>
            </Link>
            
            <div className="p-4">
              <div className="flex justify-between">
                <Link href={`/product/${product.slug || product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                <WishlistButton product={product} onlyIcon size="sm" />
              </div>
              
              <div className="mt-2 text-lg font-semibold">${product.price.toFixed(2)}</div>
              
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {product.description || 'No description available'}
              </p>
              
              <div className="mt-4">
                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      quantity: 1,
                      image: product.image
                    });
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
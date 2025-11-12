'use client'

import { useWishlist } from '@/context/WishListContext';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import Header from '@/components/ui/Header';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, clearWishlist, addWishlistToCart } = useWishlist();
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
    <>
      <Header />

      <div className="container mx-auto px-4 py-4">
        <div>
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={addWishlistToCart}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add All to Cart
          </button>
        </div>

      </div>
    
    </>
  );
}
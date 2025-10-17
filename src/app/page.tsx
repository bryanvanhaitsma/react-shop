'use client';

import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { formatPrice, getSourceBadgeColor, truncateText } from '@/utils/formatters';
import { ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const { addToCart, getItemCount } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛍️ E-Commerce Aggregator
            </h1>
            <div className="relative">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <ShoppingCart size={20} />
                <span className="font-semibold">Cart ({getItemCount()})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h2>
          <p className="text-gray-600">
            Showing {products.length} products from multiple stores
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
                {/* Source Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSourceBadgeColor(product.source)}`}>
                    {product.source}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {truncateText(product.title, 60)}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  {product.category}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-700">
                      {product.rating.rate.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({product.rating.count})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock !== undefined && (
                    <span className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>E-Commerce Aggregator - React Portfolio Project</p>
          <p className="text-sm text-gray-400 mt-2">
            Data from FakeStore API & DummyJSON
          </p>
        </div>
      </footer>
    </div>
  );
}
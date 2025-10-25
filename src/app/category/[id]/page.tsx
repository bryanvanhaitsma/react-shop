'use client';

import { use, useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product } from '@/types/Product';
import { formatPrice, getSourceBadgeColor } from '@/utils/formatters';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { id } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const decodedCategory = decodeURIComponent(id);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await apiService.getAllProducts();
        const filteredProducts = allProducts.filter(
          (product: Product) => product.category.toLowerCase() === decodedCategory.toLowerCase()
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [decodedCategory]);

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

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Products Found</h1>
          <p className="text-gray-600 mb-6">No products found in this category.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
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
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Products</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{decodedCategory}</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart size={20} />
              <span className="font-semibold">Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="object-contain p-4"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSourceBadgeColor(product.source)}`}>
                      {product.source}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-2">
                    {product.title}
                  </h2>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock !== undefined && product.stock < 10 && (
                    <span className="text-sm text-orange-600 font-semibold">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
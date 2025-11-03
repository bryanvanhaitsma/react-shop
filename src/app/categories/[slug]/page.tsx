'use client';

import { use, useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Product } from '@/types/Product';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/products/ProductCard';
import HeaderCartButton from '@/components/ui/HeaderCartButton';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const decodedCategory = decodeURIComponent(slug);

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Products</span>
            </Link>
            <h1 className="text-xl font-bold capitalize">Category: {decodedCategory}</h1>
            <HeaderCartButton />
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
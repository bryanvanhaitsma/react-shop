'use client';

import { use, useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { apiService } from '@/services/apiService';
import { Product } from '@/types/Product';
import { formatPrice, getSourceBadgeColor } from '@/utils/formatters';
import { ShoppingCart, ArrowLeft, Star, Package, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, getItemCount } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await apiService.getProduct(id);
      setProduct(fetchedProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.title} to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
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

  // Mock additional images for demo (in real app, these would come from API)
  const images = [product.image, product.image, product.image];

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
            <Link
              href="/cart/"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart size={20} />
              <span className="font-semibold">Cart ({getItemCount()})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              <div className="relative bg-gray-100 rounded-lg mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image
                  src={images[selectedImage]}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain p-8"
                  fill
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSourceBadgeColor(product.source)}`}>
                    {product.source}
                  </span>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {/* <Image
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                      fill
                    /> */}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col">
              {/* Category */}
              <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-2">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(product.rating!.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">
                    {product.rating.rate.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock !== undefined && product.stock < 10 && (
                    <span className="text-sm text-orange-600 font-semibold">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              </div>

              {/* Brand (if available) */}
              {product.brand && (
                <div className="mb-4">
                  <span className="text-gray-600">Brand: </span>
                  <span className="font-semibold text-gray-900">{product.brand}</span>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 transition font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-bold text-lg mb-4"
              >
                <ShoppingCart size={24} />
                Add to Cart - {formatPrice(product.price * quantity)}
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Package className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-xs text-gray-600 font-semibold">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-xs text-gray-600 font-semibold">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-xs text-gray-600 font-semibold">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="bg-white rounded-xl shadow-lg mt-6 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Source:</strong> {product.source}</li>
                {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
                {product.stock !== undefined && <li><strong>In Stock:</strong> {product.stock} units</li>}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Shipping & Returns</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Free standard shipping on orders over $50</li>
                <li>✅ 30-day return policy</li>
                <li>✅ Secure checkout</li>
                <li>✅ Customer support available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
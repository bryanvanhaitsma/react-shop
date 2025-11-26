'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { formatPrice, getSourceBadgeColor, slugifyString, truncateText } from '@/utils/formatters';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/Product';
import WishlistButton from '../WishListButton';
import { APPROVED_IMAGE_DOMAINS } from '../../../next.config';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [animatingButtons, setAnimatingButtons] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState(true);
  const { addToCart } = useCart();


  useEffect(() => {
    try {
      const url = new URL(product.images[0]);
      if (APPROVED_IMAGE_DOMAINS.includes(url.hostname)) {
        setImageError(false);
      }

    } catch (error) {
      setImageError(true);
      console.error('Invalid image URL:', error);
    }
  }, [product.images]);


  const handleAddToCart = (product: Product) => {
    // Start animation
    setAnimatingButtons(prev => ({ ...prev, [product.id]: true }));
    
    // Add to cart
    addToCart(product);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setAnimatingButtons(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };




  return (
    <div
      key={product.id}
      className="product--card rounded-lg shadow-md overflow-hidden flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative h-64 product--photo">
        <Link href={`/product/${product.id}`} passHref>
          {!imageError ? (
            <Image  
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain p-4"
              fill
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-4">
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
                <p className="text-sm text-gray-500 mt-2">Image unavailable</p>
              </div>
            </div>
          )}
        </Link>
        {/* Source Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSourceBadgeColor(product.source)}`}>
            {product.source}
          </span>
        </div>
        <WishlistButton 
          product={product} 
          size='sm'
          className='absolute top-0 right-1'
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold mb-2 line-clamp-2">
          {truncateText(product.title, 60)}
        </h3>
        
        <p className="text-sm mb-2 capitalize">
          <Link
            href={`/categories/${slugifyString(product.category)}`}
            className="hover:underline"
          >
            {product.category}
          </Link>
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <span>⭐</span>
            <span className="text-sm">
              {product.rating.rate.toFixed(1)}
            </span>
            <span className="text-xs">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Spacer pushes price/button to the bottom */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.stock !== undefined && (
              <span className="text-sm">
                Stock: {product.stock}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={animatingButtons[product.id]}
            className={`
              w-full py-2 px-4 rounded-lg font-semibold
              relative overflow-hidden
              transition-all duration-300
              ${animatingButtons[product.id]
                ? 'bg-green-500 text-white scale-95'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {animatingButtons[product.id] ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Added!
              </span>
            ) : (
              'Add to Cart'
            )}
            <span className={`
              absolute inset-0 bg-white/20
              transform transition-transform duration-300
              ${animatingButtons[product.id] ? 'scale-100' : 'scale-0'}
            `} />
          </button>
        </div>
      </div>
    </div>
  )
}

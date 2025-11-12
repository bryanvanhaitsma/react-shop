'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { formatPrice, getSourceBadgeColor, slugifyString, truncateText } from '@/utils/formatters';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/Product';
import WishlistButton from '../WishListButton';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [animatingButtons, setAnimatingButtons] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();


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
          <Image  
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4"
            fill 
          />
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
          className='absolute top-2 right-2'
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

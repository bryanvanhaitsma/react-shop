'use client';

import { useState } from 'react';
import { useWishlist } from '@/context/WishListContext';
import { Product } from '@/types/Product';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  showText?: boolean;
  onlyIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  className = '', 
  showText = false,
  onlyIcon = false,
  size = 'md'
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

    console.log('Product details page rendered for product:', product);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    // Prevent event propagation to parent elements (important in product cards)
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSize = sizeClasses[size];

  return (
    <>
    <button 
      onClick={handleToggleWishlist}
      className={`
        flex items-center justify-center button--wishlist
        ${onlyIcon ? '' : 'px-3 py-2 rounded-full'}
        ${isWishlisted ? 'text-red-500' : 'text-gray-500'} 
        transition-all duration-300
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Heart icon - filled or outlined based on state */}
      <svg 
        className={`${iconSize} ${isAnimating ? 'animate-pulse' : ''}`} 
        fill={isWishlisted ? "currentColor" : "none"} 
        stroke="black" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      
      {/* Optional text */}
      {showText && !onlyIcon && (
        <span className="ml-2">
          {isWishlisted ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
    </>
  );
};

export default WishlistButton;
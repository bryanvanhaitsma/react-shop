'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/Product';
import { WishlistContextType } from '@/types/WishList';
import { useCart } from '@/hooks/useCart';


const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(prevItems => {
      // Check if product is already in wishlist
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevItems; // Product already exists, don't add it again
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const addWishlistToCart = () => {

    items.forEach(item => {
      addToCart(item, 1);
    });
    clearWishlist();
    
    try {
      router.push('/cart');
    } catch (err) {
      // In case router isn't available for some environment, fail silently
      console.warn('Navigation to /cart failed', err);
    }

  }

  return (
    <WishlistContext.Provider value={{ 
      items, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist,
      addWishlistToCart,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
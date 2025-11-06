'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/Product';
import { WishlistContextType } from '@/types/WishList';


const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

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

  const removeFromWishlist = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider value={{ 
      items, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist 
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
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from '@/context/CartContext';
import { useContext } from 'react';
import { Product } from '@/types/Product';


// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock products for testing
const mockProduct1: Product = {
  id: 'test-1',
  title: 'Test Product 1',
  price: 100,
  description: 'Test description',
  category: 'electronics',
  image: 'test.jpg',
  source: 'fakestore',
};

const mockProduct2: Product = {
  id: 'test-2',
  title: 'Test Product 2',
  price: 50,
  description: 'Test description 2',
  category: 'clothing',
  image: 'test2.jpg',
  source: 'dummyjson',
};

// Helper to render hook with CartProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      expect(result.current?.cart.items).toEqual([]);
      expect(result.current?.cart.total).toBe(0);
      expect(result.current?.getItemCount()).toBe(0);
    });

    it('should load cart from localStorage if available', () => {
      const savedCart = {
        items: [{ product: mockProduct1, quantity: 2 }],
        total: 200,
      };
      localStorageMock.setItem('cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      expect(result.current?.cart.items).toHaveLength(1);
      expect(result.current?.cart.items[0].product.id).toBe('test-1');
      expect(result.current?.cart.items[0].quantity).toBe(2);
    });
  });

  describe('addToCart', () => {
    it('should add a new product to cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      expect(result.current?.cart.items).toHaveLength(1);
      expect(result.current?.cart.items[0].product.id).toBe('test-1');
      expect(result.current?.cart.items[0].quantity).toBe(1);
      expect(result.current?.cart.total).toBe(100);
    });

    it('should increase quantity if product already exists in cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      act(() => {
        result.current?.addToCart(mockProduct1, 2);
      });

      expect(result.current?.cart.items).toHaveLength(1);
      expect(result.current?.cart.items[0].quantity).toBe(3);
      expect(result.current?.cart.total).toBe(300);
    });

    it('should add multiple different products', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
        result.current?.addToCart(mockProduct2, 2);
      });

      expect(result.current?.cart.items).toHaveLength(2);
      expect(result.current?.cart.total).toBe(200); // 100 + (50 * 2)
    });

    it('should save to localStorage after adding', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      const savedCart = JSON.parse(localStorageMock.getItem('cart') || '{}');
      expect(savedCart.items).toHaveLength(1);
      expect(savedCart.total).toBe(100);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
        result.current?.addToCart(mockProduct2, 1);
      });

      act(() => {
        result.current?.removeFromCart('test-1');
      });

      expect(result.current?.cart.items).toHaveLength(1);
      expect(result.current?.cart.items[0].product.id).toBe('test-2');
      expect(result.current?.cart.total).toBe(50);
    });

    it('should handle removing non-existent product', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      act(() => {
        result.current?.removeFromCart('non-existent-id');
      });

      expect(result.current?.cart.items).toHaveLength(1);
      expect(result.current?.cart.total).toBe(100);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      act(() => {
        result.current?.updateQuantity('test-1', 5);
      });

      expect(result.current?.cart.items[0].quantity).toBe(5);
      expect(result.current?.cart.total).toBe(500);
    });

    it('should remove product if quantity is set to 0', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      act(() => {
        result.current?.updateQuantity('test-1', 0);
      });

      expect(result.current?.cart.items).toHaveLength(0);
      expect(result.current?.cart.total).toBe(0);
    });

    it('should remove product if quantity is negative', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      act(() => {
        result.current?.updateQuantity('test-1', -1);
      });

      expect(result.current?.cart.items).toHaveLength(0);
      expect(result.current?.cart.total).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
        result.current?.addToCart(mockProduct2, 2);
      });

      act(() => {
        result.current?.clearCart();
      });

      expect(result.current?.cart.items).toHaveLength(0);
      expect(result.current?.cart.total).toBe(0);
    });
  });

  describe('getItemCount', () => {
    it('should return total number of items', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 2);
        result.current?.addToCart(mockProduct2, 3);
      });

      expect(result.current?.getItemCount()).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      expect(result.current?.getItemCount()).toBe(0);
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total correctly with multiple items', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 2); // 100 * 2 = 200
        result.current?.addToCart(mockProduct2, 3); // 50 * 3 = 150
      });

      expect(result.current?.cart.total).toBe(350);
    });

    it('should update total when quantity changes', () => {
      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(mockProduct1, 1);
      });

      expect(result.current?.cart.total).toBe(100);

      act(() => {
        result.current?.updateQuantity('test-1', 10);
      });

      expect(result.current?.cart.total).toBe(1000);
    });

    it('should handle decimal prices correctly', () => {
      const decimalProduct: Product = {
        ...mockProduct1,
        id: 'decimal-1',
        price: 19.99,
      };

      const { result } = renderHook(() => useContext(CartContext), { wrapper });

      act(() => {
        result.current?.addToCart(decimalProduct, 3);
      });

      expect(result.current?.cart.total).toBeCloseTo(59.97, 2);
    });
  });
});

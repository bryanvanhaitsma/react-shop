'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatters';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="cart--item flex items-start space-x-4 p-4 rounded-lg shadow"
          >
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0 product--photo">
              <Link href={`/product/${item.product.id}`}>
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded"
                />
              </Link>
            </div>

            {/* Product Details */}
            <div className="flex-grow">
              <h3 className="font-medium">{item.product.title}</h3>
              <p className="text-sm mb-2">{formatPrice(item.product.price)}</p>
              
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="ml-4 text-red-500 hover:underline hover:text-red-600 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold text-xl">{formatPrice(cart.total)}</span>
        </div>
        <div className="flex justify-center">
          <Link href="/checkout/">
            <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>

      <Link
        href="/"
        className="inline-block mt-4 text-blue-500 hover:text-blue-600"
      >
        ← Continue Shopping
      </Link>
    </div>
  );
}
'use client';

import React from 'react'
import Link from 'next/link';
import { ShoppingCart, Heart, Folders } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishListContext';


export default function HeaderCartButtons() {
  const { getItemCount } = useCart();
  const { items } = useWishlist();

  return (
    <div className="relative flex flex-wrap gap-2">
      <Link href="/categories/">
        <button className="flex gap-2 px-4 py-2 rounded-lg font-semibold transition text-white bg-purple-900 hover:bg-purple-700">
          <Folders size={20} />Categories
        </button>
      </Link>
      {items.length > 0 && (
        <Link href="/wish-list/">
          <button className="flex gap-2 px-4 py-2 rounded-lg font-semibold transition text-white bg-gray-500">
            <Heart size={20} />Wishlist
          </button>
        </Link>
      )}
      <Link href="/cart/">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <ShoppingCart size={20} />
            <span className="font-semibold">Cart ({getItemCount()})</span>
        </button>
      </Link>
    </div>
  )
}

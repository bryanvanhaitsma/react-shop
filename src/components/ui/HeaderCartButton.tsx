'use client';

import React from 'react'
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';


export default function HeaderCartButton() {
  const { getItemCount } = useCart();

  return (
    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
      <ShoppingCart size={20} />
      <Link href="/cart">
        <span className="font-semibold">Cart ({getItemCount()})</span>
      </Link>
    </button>
  )
}

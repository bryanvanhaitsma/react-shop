import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HeaderCartButtons from './HeaderCartButtons';


export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          <Link 
            href="/"
            className="flex items-center gap-2 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Store</span>
          </Link>
          <HeaderCartButtons />
        </div>
      </div>
    </header>
  )
}

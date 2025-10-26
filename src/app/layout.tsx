import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Aggregator',
  description: 'Compare products from multiple stores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          
          {/* Footer */}
          <footer className="py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p>E-Commerce Aggregator - React Portfolio Project</p>
              <p className="text-sm mt-2">
                Data from FakeStore API, DummyJSON, and Platzi Fake Store.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
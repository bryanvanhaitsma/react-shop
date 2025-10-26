import Link from 'next/link';
import React from 'react';
import { fakeStoreApi } from '@/services/fakeStoreApi';
import { dummyJsonApi } from '@/services/dummyJsonApi';
import { platziApi } from '@/services/platziApi';
import { getSourceBadgeColor } from '@/utils/formatters';
import { slugifyString } from '@/utils/formatters';
import HeaderCartButton from '@/components/ui/HeaderCartButton';






export default async function CategoriesPage() {

  // Fetch categories from each source in parallel
  const [fakeCategories, dummyCategories, platziCategories] = await Promise.all([
    fakeStoreApi.getCategories(),
    dummyJsonApi.getCategories(),
    platziApi.getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        </div>
        <HeaderCartButton />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          {/* FakeStore Categories */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="px-2 py-1 rounded text-sm font-semibold bg-blue-100 text-blue-800">FakeStore</span>
              <span className="text-sm text-gray-500">({fakeCategories.length})</span>
            </h2>
            <ul className="space-y-2">
              {fakeCategories.map((cat: string) => (
                <li key={`fakestore-${cat}`}>
                  <Link href={`/categories/${slugifyString(cat)}`}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition flex items-center justify-between"
                  >
                    <span className="capitalize">{cat}</span>
                    <span className={getSourceBadgeColor('fakestore')}>FakeStore</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* DummyJSON Categories */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="px-2 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">DummyJSON</span>
              <span className="text-sm text-gray-500">({dummyCategories.length})</span>
            </h2>
            <ul className="space-y-2">
              {dummyCategories.map((category) => (
                <li key={`dummy-${category.slug}`}>
                  <Link href={`/categories/${encodeURIComponent(category.slug)}`}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition flex items-center justify-between"
                  >
                    <span className="capitalize">{category.name}</span>
                    <span className={getSourceBadgeColor('dummyjson')}>DummyJSON</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section> 

          {/* Platzi Categories */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="px-2 py-1 rounded text-sm font-semibold bg-purple-100 text-purple-800">Platzi</span>
              <span className="text-sm text-gray-500">({platziCategories.length})</span>
            </h2>
            <ul className="space-y-2">
              {platziCategories.map((category) => (
                <li key={`platzi-${category.id}`}>
                  <Link href={`/categories/${category.slug}`}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition flex items-center justify-between"
                  >
                    <span className="capitalize">{category.name}</span>
                    <span className={getSourceBadgeColor('platzi')}>Platzi</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* All categories combined quick links */}
        {/* <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Categories</h3>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set([
              ...fakeCategories,
              ...dummyCategories,
              ...platziNames,
            ])).map((cat: string) => (
              <Link key={`all-${cat}`} href={`/categories/${encodeURIComponent(cat)}`}
                className="inline-block px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div> */}

      </main>
    </div>
  );
}


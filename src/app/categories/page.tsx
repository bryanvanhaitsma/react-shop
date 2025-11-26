import React from 'react';
import Header from '@/components/ui/Header';
import CategoryCard from '@/components/categories/CategoryCard';
import { apiService } from '@/services/apiService';
import { platziApi } from '@/services/platziApi';






export default async function CategoriesPage() {
  // Fetch unified category names and supporting data for images/counts
  const [allCategoryNames, allProducts, platziCategories] = await Promise.all([
    apiService.getAllCategories(),
    apiService.getAllProducts(),
    platziApi.getCategories(),
  ]);

  // Build counts per category from all products
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    const name = (p.category || '').toLowerCase();
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  // Map category name -> image using Platzi categories first; else first product image; else null
  const platziImageByName = new Map<string, string>();
  for (const c of platziCategories as { name: string; image?: string; slug?: string }[]) {
    if (c?.name) platziImageByName.set(c.name.toLowerCase(), c.image || '');
  }

  const firstImageByName = new Map<string, string | null>();
  for (const p of allProducts) {
    const name = (p.category || '').toLowerCase();
    if (!name) continue;
    if (!firstImageByName.has(name)) {
      const img = p.images && p.images.length > 0 ? p.images[0] : null;
      firstImageByName.set(name, img);
    }
  }

  // Prepare sorted category list with display data
  const categories = allCategoryNames
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => {
      const key = n.toLowerCase();
      const image = platziImageByName.get(key) || firstImageByName.get(key) || null;
      const count = counts.get(key) || 0;
      return { name: n, imageUrl: image, count };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.name} name={c.name} imageUrl={c.imageUrl || undefined} count={c.count} />
          ))}
        </div>

        {/* End */}

      </main>
    </div>
  );
}


"use client";

import { PremiumProductCard } from "@/components/storefront/PremiumProductCard";
import type { Product, ProductImage, Category } from "@prisma/client";

type ProductWithImages = Product & { images: ProductImage[]; category: Category };

export function ProductGrid({ products }: { products: ProductWithImages[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-premium-taupe mb-2">No cards found matching your filters.</p>
        <p className="text-sm text-premium-taupe/80">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {products.map((product) => (
        <PremiumProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

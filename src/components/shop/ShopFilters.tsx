"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@prisma/client";

export function ShopFilters({
  categories,
  currentOccasion,
}: {
  categories: Category[];
  currentOccasion?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="space-y-6 sticky top-24">
      <div>
        <h3 className="text-xs font-medium text-premium-taupe uppercase tracking-wider mb-3">Occasion</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setFilter("occasion", "")}
                className={`block w-full text-left text-sm py-2 ${
                  !currentOccasion
                    ? "text-premium-brown font-medium"
                    : "text-premium-taupe hover:text-premium-brown"
                }`}
            >
              All occasions
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setFilter("occasion", cat.slug)}
                className={`block w-full text-left text-sm py-2 ${
                  currentOccasion === cat.slug
                    ? "text-premium-brown font-medium"
                    : "text-premium-taupe hover:text-premium-brown"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-medium text-premium-taupe uppercase tracking-wider mb-3">Sort by</h3>
        <select
          value={searchParams.get("sort") || "latest"}
          onChange={(e) => setFilter("sort", e.target.value || null)}
          className="w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-premium-accent/50"
        >
          <option value="latest">Latest</option>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
        </select>
      </div>
    </div>
  );
}

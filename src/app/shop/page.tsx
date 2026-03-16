import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Cards",
  description: "Browse our collection of personalised greeting cards for every occasion.",
};

type SearchParams = { occasion?: string; sort?: string; search?: string };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const occasion = resolved.occasion;
  const sort = resolved.sort || "latest";
  const search = resolved.search;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(occasion && {
        category: { slug: occasion },
      }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { shortDescription: { contains: search } },
        ],
      }),
    },
    include: { images: true, category: true },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : sort === "featured"
        ? { isFeatured: "desc" }
        : { sortOrder: "asc" },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-premium-brown mb-2 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          Shop All Cards
        </h1>
        <p className="text-premium-taupe max-w-xl">
          Personalised greeting cards for every occasion
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-56 flex-shrink-0">
          <ShopFilters categories={categories} currentOccasion={occasion} />
        </aside>
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

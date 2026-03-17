import { prisma } from "@/lib/prisma";
import { ProductsManager } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return (
    <ProductsManager
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  );
}

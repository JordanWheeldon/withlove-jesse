import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-serif text-2xl text-sand-800 mb-8">
        Edit {product.title}
      </h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="font-serif text-2xl text-sand-800 mb-8">
        Edit {category.name}
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}

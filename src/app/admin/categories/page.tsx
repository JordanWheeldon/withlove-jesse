import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <AdminPageShell
      title="Categories"
      description="Manage occasions and product categories."
      action={
        <Button asChild>
          <Link href="/admin/categories/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add category
          </Link>
        </Button>
      }
    >
      <div className="rounded-xl border border-sand-200 overflow-hidden bg-white shadow-soft">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand-200 bg-premium-soft/50">
              <th className="text-left p-4 font-medium text-premium-brown">Name</th>
              <th className="text-left p-4 font-medium text-premium-brown">Slug</th>
              <th className="text-left p-4 font-medium text-premium-brown">Products</th>
              <th className="text-left p-4 font-medium text-premium-brown">Status</th>
              <th className="w-16 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-sand-100 hover:bg-premium-bg/50 transition-colors">
                <td className="p-4 font-medium text-premium-brown">{c.name}</td>
                <td className="p-4 text-premium-taupe font-mono text-sm">{c.slug}</td>
                <td className="p-4 text-premium-taupe">{c._count.products}</td>
                <td className="p-4">
                  <StatusBadge status={c.isActive} />
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/categories/${c.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPageShell>
  );
}

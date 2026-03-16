import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <AdminPageShell
      title="Products"
      description="Manage your greeting cards and product catalogue."
      action={
        <Button asChild>
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      }
    >
      {products.length === 0 ? (
        <AdminEmptyState
          icon={Plus}
          title="No products yet"
          description="Add your first product to get started."
          action={
            <Button asChild>
              <Link href="/admin/products/new">Add product</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-sand-200 overflow-hidden bg-white shadow-soft">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-200 bg-premium-soft/50">
                <th className="text-left p-4 font-medium text-premium-brown">Product</th>
                <th className="text-left p-4 font-medium text-premium-brown">Category</th>
                <th className="text-left p-4 font-medium text-premium-brown">Price</th>
                <th className="text-left p-4 font-medium text-premium-brown">Status</th>
                <th className="w-16 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images.find((i) => i.isMain) || p.images[0];
                return (
                  <tr key={p.id} className="border-b border-sand-100 hover:bg-premium-bg/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-premium-soft flex-shrink-0">
                          {img ? (
                            <Image
                              src={img.url}
                              alt={p.title}
                              width={48}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-premium-taupe/60 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-premium-brown">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-premium-taupe">{p.category.name}</td>
                    <td className="p-4">
                      {p.salePrice ? (
                        <span>
                          <span className="font-medium text-premium-brown">{formatPrice(p.salePrice)}</span>
                          <span className="text-premium-taupe line-through text-sm ml-1">{formatPrice(p.price)}</span>
                        </span>
                      ) : (
                        formatPrice(p.price)
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={p.isActive} />
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageShell>
  );
}

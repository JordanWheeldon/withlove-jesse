import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PromotionList } from "@/components/admin/PromotionList";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany();

  return (
    <AdminPageShell
      title="Promotions"
      description="Manage banners and promotional offers."
      action={
        <Button asChild>
          <Link href="/admin/promotions/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add promotion
          </Link>
        </Button>
      }
    >
      {promotions.length === 0 ? (
        <AdminEmptyState
          icon={Tag}
          title="No promotions yet"
          description="Add promotional banners and discount codes."
          action={
            <Button asChild>
              <Link href="/admin/promotions/new">Add promotion</Link>
            </Button>
          }
        />
      ) : (
        <PromotionList promotions={promotions} />
      )}
    </AdminPageShell>
  );
}

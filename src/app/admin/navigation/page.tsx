import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { NavigationList } from "@/components/admin/NavigationList";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } });
  const headerItems = items.filter((i) => i.location === "header");
  const footerItems = items.filter((i) => i.location === "footer");

  return (
    <AdminPageShell
      title="Navigation Menus"
      description="Manage header and footer links."
      action={
        <Button asChild>
          <Link href="/admin/navigation/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add item
          </Link>
        </Button>
      }
    >
      {items.length === 0 ? (
        <AdminEmptyState
          icon={Menu}
          title="No menu items"
          description="Add links for the header and footer."
          action={
            <Button asChild>
              <Link href="/admin/navigation/new">Add item</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="font-medium text-premium-brown mb-4">Header</h3>
            <NavigationList items={headerItems} />
          </div>
          <div>
            <h3 className="font-medium text-premium-brown mb-4">Footer</h3>
            <NavigationList items={footerItems} />
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

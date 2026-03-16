import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { NavigationForm } from "@/components/admin/NavigationForm";

export const dynamic = "force-dynamic";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.navigationItem.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <AdminPageShell title="Edit menu item" description={item.label}>
      <div className="max-w-xl">
        <NavigationForm item={item} />
      </div>
    </AdminPageShell>
  );
}

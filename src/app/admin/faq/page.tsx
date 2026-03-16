import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { FaqList } from "@/components/admin/FaqList";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminPageShell
      title="FAQ"
      description="Manage frequently asked questions."
      action={
        <Button asChild>
          <Link href="/admin/faq/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Link>
        </Button>
      }
    >
      {faqs.length === 0 ? (
        <AdminEmptyState
          icon={HelpCircle}
          title="No FAQs yet"
          description="Add frequently asked questions for your customers."
          action={
            <Button asChild>
              <Link href="/admin/faq/new">Add FAQ</Link>
            </Button>
          }
        />
      ) : (
        <FaqList faqs={faqs} />
      )}
    </AdminPageShell>
  );
}

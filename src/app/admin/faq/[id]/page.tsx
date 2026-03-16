import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { FaqForm } from "@/components/admin/FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <AdminPageShell
      title="Edit FAQ"
      description={`Editing: ${faq.question}`}
    >
      <div className="max-w-xl">
        <FaqForm faq={faq} />
      </div>
    </AdminPageShell>
  );
}

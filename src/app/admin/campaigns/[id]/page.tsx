import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { CampaignForm } from "@/components/admin/CampaignForm";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.seasonalCampaign.findUnique({
    where: { id },
  });
  if (!campaign) notFound();

  return (
    <AdminPageShell title="Edit campaign" description={campaign.name}>
      <div className="max-w-xl">
        <CampaignForm campaign={campaign} />
      </div>
    </AdminPageShell>
  );
}

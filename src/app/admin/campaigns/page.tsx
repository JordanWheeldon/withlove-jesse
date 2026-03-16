import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CampaignList } from "@/components/admin/CampaignList";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.seasonalCampaign.findMany({
    orderBy: { homepageOrder: "asc" },
  });

  return (
    <AdminPageShell
      title="Seasonal Campaigns"
      description="Manage Christmas, Valentine's Day, and other seasonal campaigns."
      action={
        <Button asChild>
          <Link href="/admin/campaigns/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add campaign
          </Link>
        </Button>
      }
    >
      {campaigns.length === 0 ? (
        <AdminEmptyState
          icon={Calendar}
          title="No campaigns yet"
          description="Create seasonal campaigns to feature on the homepage."
          action={
            <Button asChild>
              <Link href="/admin/campaigns/new">Add campaign</Link>
            </Button>
          }
        />
      ) : (
        <CampaignList campaigns={campaigns} />
      )}
    </AdminPageShell>
  );
}

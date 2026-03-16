import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { SettingsForm } from "@/components/admin/SettingsForm";

const KEYS = [
  { key: "site_title", label: "Site title" },
  { key: "announcement_bar", label: "Announcement bar text" },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "contact_intro", label: "Contact page intro" },
  { key: "shipping_notice", label: "Shipping notice" },
];

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSettings.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;

  return (
    <AdminPageShell
      title="Site Settings"
      description="Business details and global settings."
    >
      <div className="max-w-xl">
        <SettingsForm keys={KEYS} initial={settings} />
      </div>
    </AdminPageShell>
  );
}

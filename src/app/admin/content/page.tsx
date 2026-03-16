import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const blocks = await prisma.editableContentBlock.findMany({
    orderBy: { key: "asc" },
  });

  const keyToLabel: Record<string, string> = {
    announcement_banner: "Announcement banner (legacy - use Site Settings)",
    hero_image: "Hero image URL (fallback when hero slides empty)",
    hero_slides: "Hero carousel – one image URL per line",
    hero_title: "Homepage hero title",
    hero_subtitle: "Homepage hero subtitle",
    hero_button: "Homepage hero button text",
    delivery_content: "Delivery page content (HTML)",
    returns_content: "Returns page content (HTML)",
  };

  return (
    <AdminPageShell
      title="Content Blocks"
      description="Update key text and messages across your site."
    >
      <div className="max-w-2xl space-y-6">
        {blocks.map((block) => (
          <ContentEditor
            key={block.id}
            block={block}
            label={keyToLabel[block.key] || block.key}
            rows={block.key.includes("_content") || block.key === "hero_slides" ? 10 : 3}
          />
        ))}
        {blocks.length === 0 && (
          <div className="rounded-xl border border-sand-200 bg-white p-12 text-center text-premium-taupe">
            No content blocks yet. Run the seed script to create defaults.
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}

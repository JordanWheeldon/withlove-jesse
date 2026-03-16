import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <AdminPageShell
      title="Media Library"
      description="Upload pictures from your computer. Use these images when adding or editing products."
    >
      <MediaLibrary />
    </AdminPageShell>
  );
}

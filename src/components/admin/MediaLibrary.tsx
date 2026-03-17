"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check, Image as ImageIcon, Trash2, FileText } from "lucide-react";

type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number | null;
  alt: string | null;
  createdAt: string;
};

function fileTypeLabel(mime: string): string {
  if (mime === "image/png") return "PNG";
  if (mime === "image/jpeg" || mime === "image/jpg") return "JPG";
  if (mime === "image/webp") return "WebP";
  if (mime === "application/pdf") return "PDF";
  return mime.split("/")[1]?.toUpperCase() ?? "File";
}

export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadError(null);
    setUploading(true);

    const UPLOAD_TIMEOUT_MS = 55000;
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.set("file", file);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
      try {
        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: fd,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        let data: { error?: string };
        try {
          data = await res.json();
        } catch {
          setUploadError("Upload failed. Try a smaller image or paste an image URL on the product form.");
          failed++;
          continue;
        }
        if (!res.ok) {
          failed++;
          setUploadError(data.error || "Upload failed");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        failed++;
        if (err instanceof Error && err.name === "AbortError") {
          setUploadError("Upload timed out. Try one small image at a time, or paste an image URL when editing a product.");
        } else {
          setUploadError("Upload failed. Try a smaller image or use an image URL on the product form.");
        }
      }
    }

    setUploading(false);
    e.target.value = "";
    if (failed < files.length) await fetchAssets();
  }

  function copyUrl(asset: MediaAsset) {
    const fullUrl = asset.url.startsWith("http") ? asset.url : `${typeof window !== "undefined" ? window.location.origin : ""}${asset.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div className="space-y-8">
      <div
        onClick={() => !uploading && document.getElementById("media-upload-input")?.click()}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-premium-accent/50 bg-premium-soft/30 p-12 cursor-pointer hover:border-premium-accent hover:bg-premium-soft/50 transition-colors"
      >
        <input
          id="media-upload-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <Upload className="h-14 w-14 text-premium-brown mb-4" />
        <p className="text-lg font-medium text-premium-brown mb-1">
          {uploading ? "Uploading…" : "Add files from your computer"}
        </p>
        <p className="text-sm text-premium-taupe">
          PNG, JPG, WebP, PDF. Max 4MB on live site, 10MB locally.
        </p>
      </div>

      {uploadError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {uploadError}
        </p>
      )}

      <div>
        <h2 className="font-serif text-xl text-premium-brown mb-4">Your uploads</h2>
        {loading ? (
          <p className="text-premium-taupe">Loading…</p>
        ) : assets.length === 0 ? (
          <p className="text-premium-taupe py-8">
            No images yet. Upload pictures above, then use their URLs when adding or editing products.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm group"
              >
                <div className="aspect-square bg-premium-soft flex items-center justify-center relative">
                  {isImage(asset.mimeType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.alt || asset.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="h-12 w-12 text-premium-taupe" />
                  )}
                  <span className="absolute top-2 right-2 text-xs font-medium bg-white/90 text-sand-700 px-1.5 py-0.5 rounded">
                    {fileTypeLabel(asset.mimeType)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    onClick={async () => {
                      if (!confirm("Remove this file from the library?")) return;
                      const res = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
                      if (res.ok) await fetchAssets();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-sand-800 truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  {asset.size != null && (
                    <p className="text-xs text-premium-taupe mt-0.5">
                      {(asset.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  <div className="flex gap-1 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyUrl(asset)}
                    >
                      {copiedId === asset.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedId === asset.id ? "Copied" : "Copy URL"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-premium-taupe border-t border-sand-200 pt-6">
        When creating or editing a product, paste the copied URL into the main image or gallery URL fields.
      </p>
    </div>
  );
}

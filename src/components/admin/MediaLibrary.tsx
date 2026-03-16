"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check, Image as ImageIcon } from "lucide-react";

type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number | null;
  alt: string | null;
  createdAt: string;
};

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
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <Upload className="h-14 w-14 text-premium-brown mb-4" />
        <p className="text-lg font-medium text-premium-brown mb-1">
          {uploading ? "Uploading…" : "Add pictures from your computer"}
        </p>
        <p className="text-sm text-premium-taupe">
          Click here or drag files. PNG, JPG. Max 4MB on live site, 10MB locally.
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
                className="rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-premium-soft flex items-center justify-center">
                  {isImage(asset.mimeType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.alt || asset.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-premium-taupe" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-sand-800 truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => copyUrl(asset)}
                  >
                    {copiedId === asset.id ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copiedId === asset.id ? "Copied" : "Copy URL"}
                  </Button>
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

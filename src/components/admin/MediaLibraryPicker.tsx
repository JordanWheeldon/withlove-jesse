"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
};

export function MediaLibraryPicker({
  open,
  onClose,
  onSelect,
  title = "Choose from Media Library",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAssets(Array.isArray(data) ? data : []))
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  function fullUrl(url: string) {
    return url.startsWith("http") ? url : (typeof window !== "undefined" ? window.location.origin : "") + url;
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-sand-200 bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-sand-200">
          <h3 className="font-medium text-premium-brown">{title}</h3>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
        <div className="overflow-auto p-4 flex-1">
          {loading ? (
            <p className="text-premium-taupe py-8">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="text-premium-taupe py-8">
              No images in Media Library yet. Upload some in Admin → Media Library first.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className="rounded-lg border border-sand-200 overflow-hidden bg-premium-soft/30 hover:border-premium-accent hover:ring-2 hover:ring-premium-accent/20 transition-all text-left"
                  onClick={() => {
                    onSelect(fullUrl(asset.url));
                    onClose();
                  }}
                >
                  <div className="aspect-square flex items-center justify-center bg-premium-soft/50">
                    {isImage(asset.mimeType) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.url}
                        alt={asset.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-premium-taupe" />
                    )}
                  </div>
                  <p className="p-2 text-xs font-medium text-sand-800 truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <p className="px-2 pb-2 text-xs text-premium-taupe">Click to use</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

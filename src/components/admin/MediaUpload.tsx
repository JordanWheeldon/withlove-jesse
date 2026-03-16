"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileImage } from "lucide-react";

const ACCEPT = "image/png,image/jpeg,image/jpg,application/pdf";

export function MediaUpload({
  value,
  onChange,
  label = "Upload image",
  accept = ACCEPT,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    const fd = new FormData();
    fd.set("file", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let data: { url?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        setError("Upload failed. Try Admin → Media Library to upload, then paste the image URL here.");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      if (data.url) onChange(data.url);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setError("Upload timed out. Go to Admin → Media Library, upload there, then paste the image URL below.");
      } else {
        setError("Upload failed. Go to Admin → Media Library to upload, then paste the image URL here.");
      }
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  const isImage = value?.match(/\.(png|jpg|jpeg|webp|gif)$/i) || value?.startsWith("/uploads/");

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-lg border border-sand-200 p-4 bg-premium-bg">
          {isImage ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-premium-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-premium-taupe">
              <FileImage className="h-8 w-8 shrink-0" />
              <span className="text-sm truncate max-w-[200px]">{value}</span>
              <span className="text-xs bg-sand-200 text-sand-600 px-1.5 py-0.5 rounded">PDF</span>
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Replace"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sand-200 p-8 cursor-pointer hover:border-premium-accent hover:bg-premium-bg/50 transition-colors"
        >
          <Upload className="h-10 w-10 text-premium-taupe mb-2" />
          <p className="text-sm text-premium-taupe text-center">
            {loading ? "Uploading..." : "Click to upload PNG, JPG, or PDF"}
          </p>
          <p className="text-xs text-premium-taupe/70 mt-1">Max 10MB (local) or 4MB (live site). Or paste an image URL below.</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

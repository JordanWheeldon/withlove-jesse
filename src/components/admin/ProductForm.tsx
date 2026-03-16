"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "./MediaUpload";
import type { Product, ProductImage, Category } from "@prisma/client";

type ProductWithImages = Product & { images: ProductImage[] };

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductWithImages;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState(
    () => (product?.images.find((i) => i.isMain) || product?.images[0])?.url || ""
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    const nonMain = product?.images.filter((i) => !i.isMain).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
    return nonMain.map((i) => i.url);
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body: Record<string, unknown> = {
      title: fd.get("title"),
      slug: fd.get("slug") || slugify(String(fd.get("title"))),
      shortDescription: fd.get("shortDescription"),
      fullDescription: fd.get("fullDescription"),
      price: parseFloat(String(fd.get("price"))) || 0,
      salePrice: fd.get("salePrice")
        ? parseFloat(String(fd.get("salePrice")))
        : null,
      categoryId: fd.get("categoryId"),
      isActive: fd.get("isActive") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      isNewArrival: fd.get("isNewArrival") === "on",
      isBestSeller: fd.get("isBestSeller") === "on",
      personalisationEnabled: fd.get("personalisationEnabled") === "on",
      personalisationInstructions: fd.get("personalisationInstructions"),
      recipientNameLimit: parseInt(String(fd.get("recipientNameLimit"))) || 30,
      messageLimit: parseInt(String(fd.get("messageLimit"))) || 200,
      insideMessageLimit: parseInt(String(fd.get("insideMessageLimit"))) || 100,
      senderNameLimit: parseInt(String(fd.get("senderNameLimit"))) || 30,
      seoTitle: fd.get("seoTitle") || undefined,
      seoDescription: fd.get("seoDescription") || undefined,
      mainImageUrl: mainImageUrl || undefined,
      galleryUrls: galleryUrls.filter(Boolean),
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
    setLoading(false);
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const mainImage = product?.images.find((i) => i.isMain) || product?.images[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={product?.title}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-generated from title"
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={product?.categoryId}
          className="mt-2 w-full rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          defaultValue={product?.shortDescription || ""}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="fullDescription">Full description (HTML)</Label>
        <Textarea
          id="fullDescription"
          name="fullDescription"
          defaultValue={product?.fullDescription || ""}
          rows={4}
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (£)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product ? Number(product.price) : ""}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="salePrice">Sale price (£)</Label>
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            step="0.01"
            defaultValue={product && product.salePrice ? Number(product.salePrice) : ""}
            placeholder="Leave blank for no sale"
            className="mt-2"
          />
        </div>
      </div>
      <div>
        <MediaUpload
          label="Main image"
          value={mainImageUrl}
          onChange={setMainImageUrl}
          accept="image/png,image/jpeg,image/jpg"
        />
        <p className="text-xs text-premium-taupe mt-1">Or paste image URL (use this on the live site)</p>
        <Input
          value={mainImageUrl}
          onChange={(e) => setMainImageUrl(e.target.value)}
          placeholder="https://..."
          className="mt-2"
        />
      </div>
      <div>
        <Label>Additional images (gallery)</Label>
        <p className="text-xs text-premium-taupe mt-1 mb-2">
          Add more image URLs for the product page gallery. One per line or use the inputs below.
        </p>
        <div className="space-y-2">
          {galleryUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const next = [...galleryUrls];
                  next[i] = e.target.value;
                  setGalleryUrls(next);
                }}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-600 shrink-0"
                onClick={() => setGalleryUrls(galleryUrls.filter((_, j) => j !== i))}
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setGalleryUrls([...galleryUrls, ""])}
          >
            + Add image URL
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="personalisationInstructions">Personalisation instructions</Label>
        <Textarea
          id="personalisationInstructions"
          name="personalisationInstructions"
          defaultValue={product?.personalisationInstructions || ""}
          rows={2}
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipientNameLimit">Recipient name limit</Label>
          <Input
            id="recipientNameLimit"
            name="recipientNameLimit"
            type="number"
            defaultValue={product?.recipientNameLimit ?? 30}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="messageLimit">Message limit</Label>
          <Input
            id="messageLimit"
            name="messageLimit"
            type="number"
            defaultValue={product?.messageLimit ?? 200}
            className="mt-2"
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
            className="rounded border-sand-300"
          />
          Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
            className="rounded border-sand-300"
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isNewArrival"
            defaultChecked={product?.isNewArrival ?? false}
            className="rounded border-sand-300"
          />
          New arrival
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isBestSeller"
            defaultChecked={product?.isBestSeller ?? false}
            className="rounded border-sand-300"
          />
          Best seller
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="personalisationEnabled"
            defaultChecked={product?.personalisationEnabled ?? true}
            className="rounded border-sand-300"
          />
          Personalisation enabled
        </label>
      </div>
      <div>
        <Label htmlFor="seoTitle">SEO title</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={product?.seoTitle || ""} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="seoDescription">SEO description</Label>
        <Textarea id="seoDescription" name="seoDescription" defaultValue={product?.seoDescription || ""} rows={2} className="mt-2" />
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@prisma/client";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name"));
    const slug = fd.get("slug") ? String(fd.get("slug")) : slugify(name);

    const body = {
      name,
      slug,
      description: fd.get("description") || null,
      isActive: fd.get("isActive") === "on",
      sortOrder: parseInt(String(fd.get("sortOrder"))) || 0,
    };

    const url = category
      ? `/api/admin/categories/${category.id}`
      : "/api/admin/categories";
    const method = category ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/categories");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="slug">Page URL</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={category?.slug}
          placeholder="auto-generated"
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description || ""}
          rows={2}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          className="mt-2"
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={category?.isActive ?? true}
          className="rounded border-sand-300"
        />
        Active
      </label>
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : category ? "Save changes" : "Create category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

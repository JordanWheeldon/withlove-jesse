"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "./MediaUpload";
import type { SeasonalCampaign } from "@prisma/client";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function CampaignForm({ campaign }: { campaign?: SeasonalCampaign }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState(campaign?.bannerImage || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name"));
    const body = {
      name,
      slug: fd.get("slug") || slugify(name),
      isActive: fd.get("isActive") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      startsAt: fd.get("startsAt") || null,
      endsAt: fd.get("endsAt") || null,
      bannerTitle: fd.get("bannerTitle") || null,
      bannerSubtitle: fd.get("bannerSubtitle") || null,
      bannerCta: fd.get("bannerCta") || null,
      bannerImage: bannerImage || null,
      homepageOrder: parseInt(String(fd.get("homepageOrder"))) || 0,
    };

    const url = campaign ? `/api/admin/campaigns/${campaign.id}` : "/api/admin/campaigns";
    const method = campaign ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/campaigns");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={campaign?.name} required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="slug">Page URL</Label>
        <Input id="slug" name="slug" defaultValue={campaign?.slug} placeholder="auto" className="mt-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startsAt">Start date</Label>
          <Input id="startsAt" name="startsAt" type="date" defaultValue={campaign?.startsAt?.toString().slice(0, 10)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="endsAt">End date</Label>
          <Input id="endsAt" name="endsAt" type="date" defaultValue={campaign?.endsAt?.toString().slice(0, 10)} className="mt-2" />
        </div>
      </div>
      <div>
        <Label htmlFor="bannerTitle">Banner title</Label>
        <Input id="bannerTitle" name="bannerTitle" defaultValue={campaign?.bannerTitle || ""} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="bannerSubtitle">Banner subtitle</Label>
        <Input id="bannerSubtitle" name="bannerSubtitle" defaultValue={campaign?.bannerSubtitle || ""} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="bannerCta">Banner CTA</Label>
        <Input id="bannerCta" name="bannerCta" defaultValue={campaign?.bannerCta || ""} placeholder="Shop now" className="mt-2" />
      </div>
      <MediaUpload
        label="Banner image"
        value={bannerImage}
        onChange={setBannerImage}
        accept="image/png,image/jpeg,image/jpg"
      />
      <div>
        <Label htmlFor="homepageOrder">Homepage order</Label>
        <Input id="homepageOrder" name="homepageOrder" type="number" defaultValue={campaign?.homepageOrder ?? 0} className="mt-2" />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={campaign?.isActive ?? true} className="rounded" />
          Active
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={campaign?.isFeatured ?? false} className="rounded" />
          Featured on homepage
        </label>
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : campaign ? "Save" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}

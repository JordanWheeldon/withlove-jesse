"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Search,
  LayoutGrid,
  List,
  Layers,
  ChevronDown,
  Tag,
  Star,
  Sparkles,
} from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  category: Category;
  images: { id: string; url: string; isMain: boolean }[];
};

const DEBOUNCE_MS = 300;

export function ProductsManager({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [sort, setSort] = useState("sortOrder");
  const [viewMode, setViewMode] = useState<"table" | "cards" | "grouped">("table");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (status !== "all") params.set("status", status);
    if (featured) params.set("featured", "true");
    if (bestSeller) params.set("bestSeller", "true");
    if (newArrival) params.set("newArrival", "true");
    params.set("sort", sort);
    const res = await fetch(`/api/admin/products?${params}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    } else setProducts([]);
    setLoading(false);
  }, [search, categoryId, status, featured, bestSeller, newArrival, sort]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const groupedByCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.category.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <AdminPageShell
      title="Products"
      description="Manage your catalogue. Search, filter by occasion, and switch between table or card view."
      action={
        <Button asChild>
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-sand-200 bg-white">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-premium-taupe" />
            <Input
              placeholder="Search by title or page URL..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm min-w-[160px]"
          >
            <option value="">All occasions</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm min-w-[120px]"
          >
            <option value="sortOrder">Order</option>
            <option value="title">Title A–Z</option>
            <option value="price">Price</option>
          </select>
          <div className="flex items-center gap-1 border border-sand-200 rounded-lg p-1 bg-premium-bg">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${viewMode === "table" ? "bg-white shadow-sm text-premium-brown" : "text-premium-taupe hover:text-premium-brown"}`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded ${viewMode === "cards" ? "bg-white shadow-sm text-premium-brown" : "text-premium-taupe hover:text-premium-brown"}`}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grouped")}
              className={`p-2 rounded ${viewMode === "grouped" ? "bg-white shadow-sm text-premium-brown" : "text-premium-taupe hover:text-premium-brown"}`}
              title="Grouped by occasion"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                status === s
                  ? "bg-premium-brown text-white"
                  : "bg-premium-soft text-premium-taupe hover:bg-sand-200"
              }`}
            >
              {s === "all" ? "All" : s === "active" ? "Active" : "Inactive"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
              featured ? "bg-amber-100 text-amber-800" : "bg-premium-soft text-premium-taupe hover:bg-sand-200"
            }`}
          >
            <Star className="h-3.5 w-3.5" /> Featured
          </button>
          <button
            type="button"
            onClick={() => setBestSeller(!bestSeller)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
              bestSeller ? "bg-emerald-100 text-emerald-800" : "bg-premium-soft text-premium-taupe hover:bg-sand-200"
            }`}
          >
            <Tag className="h-3.5 w-3.5" /> Best seller
          </button>
          <button
            type="button"
            onClick={() => setNewArrival(!newArrival)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
              newArrival ? "bg-sky-100 text-sky-800" : "bg-premium-soft text-premium-taupe hover:bg-sand-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> New
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-sand-200 bg-white p-12 text-center text-premium-taupe">
            Loading…
          </div>
        ) : products.length === 0 ? (
          <AdminEmptyState
            icon={Search}
            title="No products match"
            description="Try changing search or filters."
          />
        ) : viewMode === "table" ? (
          <div className="rounded-xl border border-sand-200 overflow-hidden bg-white shadow-soft">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-200 bg-premium-soft/50">
                  <th className="text-left p-4 font-medium text-premium-brown w-20">Image</th>
                  <th className="text-left p-4 font-medium text-premium-brown">Product</th>
                  <th className="text-left p-4 font-medium text-premium-brown">Occasion</th>
                  <th className="text-left p-4 font-medium text-premium-brown">Price</th>
                  <th className="text-left p-4 font-medium text-premium-brown">Status</th>
                  <th className="w-16 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const img = p.images.find((i) => i.isMain) || p.images[0];
                  return (
                    <tr key={p.id} className="border-b border-sand-100 hover:bg-premium-bg/50 transition-colors">
                      <td className="p-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-premium-soft flex-shrink-0">
                          {img ? (
                            <Image
                              src={img.url}
                              alt={p.title}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-premium-taupe/60 text-xs">—</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-premium-brown">{p.title}</span>
                        <span className="text-premium-taupe text-xs block font-mono">{p.slug}</span>
                      </td>
                      <td className="p-4 text-premium-taupe">{p.category.name}</td>
                      <td className="p-4">
                        {p.salePrice != null ? (
                          <span>
                            <span className="font-medium text-premium-brown">{formatPrice(p.salePrice)}</span>
                            <span className="text-premium-taupe line-through text-sm ml-1">{formatPrice(p.price)}</span>
                          </span>
                        ) : (
                          formatPrice(p.price)
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <StatusBadge status={p.isActive} />
                          {p.isFeatured && <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Featured</span>}
                          {p.isBestSeller && <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Bestseller</span>}
                          {p.isNewArrival && <span className="text-xs bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">New</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${p.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => {
              const img = p.images.find((i) => i.isMain) || p.images[0];
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-sand-200 bg-white overflow-hidden shadow-soft hover:shadow-mid transition-shadow"
                >
                  <div className="aspect-[4/3] bg-premium-soft relative">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-premium-taupe/60 text-sm">No image</div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {p.isFeatured && <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Featured</span>}
                      {p.isBestSeller && <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Bestseller</span>}
                      {p.isNewArrival && <span className="text-xs bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">New</span>}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-premium-brown truncate">{p.title}</p>
                    <p className="text-sm text-premium-taupe">{p.category.name}</p>
                    <p className="mt-1 font-medium">{p.salePrice != null ? formatPrice(p.salePrice) : formatPrice(p.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={p.isActive} />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${p.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByCategory).map(([catId, prods]) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <div key={catId}>
                  <h3 className="text-lg font-medium text-premium-brown mb-3 flex items-center gap-2">
                    {cat?.name ?? "Other"}
                    <span className="text-sm font-normal text-premium-taupe">({prods.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {prods.map((p) => {
                      const img = p.images.find((i) => i.isMain) || p.images[0];
                      return (
                        <div
                          key={p.id}
                          className="rounded-xl border border-sand-200 bg-white overflow-hidden shadow-soft hover:shadow-mid transition-shadow flex"
                        >
                          <div className="w-24 h-24 flex-shrink-0 bg-premium-soft relative">
                            {img ? (
                              <Image src={img.url} alt={p.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-premium-taupe/60 text-xs">—</div>
                            )}
                          </div>
                          <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
                            <p className="font-medium text-premium-brown truncate">{p.title}</p>
                            <p className="text-sm text-premium-taupe">{p.salePrice != null ? formatPrice(p.salePrice) : formatPrice(p.price)}</p>
                            <Button variant="ghost" size="sm" className="mt-1 self-start" asChild>
                              <Link href={`/admin/products/${p.id}`}>Edit</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}

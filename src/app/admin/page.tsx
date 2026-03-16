import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import {
  Package,
  FolderOpen,
  ShoppingBag,
  Plus,
  FileText,
  FolderPlus,
  Calendar,
  Tag,
  HelpCircle,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    productCount,
    activeProductCount,
    inactiveProductCount,
    featuredCount,
    productsMissingImage,
    productsMissingSeo,
    categoryCount,
    activeCategoryCount,
    campaignCount,
    activeCampaignCount,
    promotionCount,
    activePromotionCount,
    faqCount,
    contentBlockCount,
    orderCount,
    recentOrders,
    productsLatest,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({
      where: {
        images: { none: {} },
      },
    }),
    prisma.product.count({
      where: {
        OR: [
          { seoTitle: null },
          { seoTitle: "" },
          { seoDescription: null },
          { seoDescription: "" },
        ],
      },
    }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.seasonalCampaign.count(),
    prisma.seasonalCampaign.count({ where: { isActive: true } }),
    prisma.promotion.count(),
    prisma.promotion.count({ where: { isActive: true } }),
    prisma.faq.count(),
    prisma.editableContentBlock.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      take: 4,
      orderBy: { sortOrder: "asc" },
      include: { images: true },
    }),
  ]);

  return (
    <AdminPageShell title="Dashboard" description="Overview of your store">
      {/* Primary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          href="/admin/products"
          label="Products"
          value={productCount}
          sub={`${activeProductCount} active`}
          icon={Package}
        />
        <MetricCard
          href="/admin/categories"
          label="Categories"
          value={categoryCount}
          sub={`${activeCategoryCount} active`}
          icon={FolderOpen}
        />
        <MetricCard
          href="/admin/orders"
          label="Orders"
          value={orderCount}
          icon={ShoppingBag}
        />
        <MetricCard
          href="/admin/campaigns"
          label="Campaigns"
          value={campaignCount}
          sub={`${activeCampaignCount} active`}
          icon={Calendar}
        />
        <MetricCard
          href="/admin/promotions"
          label="Promotions"
          value={promotionCount}
          sub={`${activePromotionCount} active`}
          icon={Tag}
        />
        <MetricCard
          href="/admin/content"
          label="Content blocks"
          value={contentBlockCount}
          icon={FileText}
        />
      </div>

      {/* Alerts & completeness */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <h3 className="font-medium text-premium-brown mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Setup & completeness
          </h3>
          <ul className="space-y-2">
            {productsMissingImage > 0 && (
              <li>
                <Link
                  href="/admin/products"
                  className="flex items-center justify-between text-sm text-amber-700 hover:underline"
                >
                  <span>{productsMissingImage} products missing images</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            )}
            {productsMissingSeo > 0 && (
              <li>
                <Link
                  href="/admin/products"
                  className="flex items-center justify-between text-sm text-amber-700 hover:underline"
                >
                  <span>{productsMissingSeo} products missing SEO fields</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            )}
            {inactiveProductCount > 0 && (
              <li className="text-sm text-premium-taupe">
                {inactiveProductCount} inactive products (hidden from store)
              </li>
            )}
            {featuredCount === 0 && (
              <li className="text-sm text-amber-700">
                No featured products — homepage featured section will be empty
              </li>
            )}
            {faqCount === 0 && (
              <li className="text-sm text-amber-700">
                No FAQs — add some for the FAQ page
              </li>
            )}
            {productsMissingImage === 0 &&
              productsMissingSeo === 0 &&
              featuredCount > 0 &&
              faqCount > 0 && (
                <li className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Content looks complete
                </li>
              )}
          </ul>
        </div>

        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <h3 className="font-medium text-premium-brown mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Content overview
          </h3>
          <ul className="space-y-2 text-sm text-premium-taupe">
            <li>Featured products: {featuredCount}</li>
            <li>FAQs published: {faqCount}</li>
            <li>Homepage content blocks: {contentBlockCount}</li>
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-sand-200 bg-white p-6 mb-8">
        <h3 className="font-medium text-premium-brown mb-4">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/categories/new" className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              Add category
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/faq/new" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Add FAQ
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Edit content
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent orders & recently updated */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-premium-brown">Recent orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-premium-taupe hover:text-premium-brown"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-premium-taupe">No orders yet</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center justify-between text-sm hover:underline"
                  >
                    <span className="text-premium-brown">
                      #{o.orderNumber} · {o.email}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sand-100 text-sand-700 capitalize">
                      {o.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-premium-brown">
              Latest products
            </h3>
            <Link
              href="/admin/products"
              className="text-sm text-premium-taupe hover:text-premium-brown"
            >
              View all
            </Link>
          </div>
          {productsLatest.length === 0 ? (
            <p className="text-sm text-premium-taupe">No products yet</p>
          ) : (
            <ul className="space-y-2">
              {productsLatest.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 text-sm hover:underline"
                  >
                    {p.images[0] ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-premium-soft flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0].url}
                          alt={p.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-premium-soft flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-4 w-4 text-premium-taupe" aria-hidden="true" />
                      </div>
                    )}
                    <span className="text-premium-brown truncate">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}

function MetricCard({
  href,
  label,
  value,
  sub,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-sand-200 bg-white p-4 hover:shadow-premium hover:border-sand-300 transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-premium-taupe group-hover:text-premium-brown" />
        <span className="text-xs font-medium text-premium-taupe uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold text-premium-brown">{value}</p>
      {sub && <p className="text-xs text-premium-taupe mt-0.5">{sub}</p>}
    </Link>
  );
}

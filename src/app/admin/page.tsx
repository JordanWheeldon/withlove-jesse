import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
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
  PoundSterling,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getUTCDay();
  const diff = (day === 0 ? 6 : day - 1);
  x.setUTCDate(x.getUTCDate() - diff);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}
function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setUTCDate(1);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const [
    productCount,
    activeProductCount,
    inactiveProductCount,
    featuredCount,
    bestSellerCount,
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
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
    revenueAll,
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    recentOrders,
    productsLatest,
    orderItemsAgg,
    mediaAssetCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isBestSeller: true } }),
    prisma.product.count({ where: { images: { none: {} } } }),
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
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: weekStart } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: monthStart } } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ take: 4, orderBy: { sortOrder: "asc" }, include: { images: true } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
    }),
    prisma.mediaAsset.count(),
  ]);

  const sorted = [...orderItemsAgg].sort((a, b) => (b._sum.quantity ?? 0) - (a._sum.quantity ?? 0));
  const top10ProductIds = sorted.slice(0, 10).map((o) => o.productId);
  const bestSellingProducts =
    top10ProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: top10ProductIds } },
          include: { images: true },
        })
      : [];
  const soldByProductId = Object.fromEntries(
    sorted.map((o) => [o.productId, o._sum.quantity ?? 0])
  );
  const totalUnitsSold = sorted.reduce((acc, o) => acc + (o._sum.quantity ?? 0), 0);
  const avgOrderValue =
    orderCount > 0 && revenueAll._sum.total != null
      ? revenueAll._sum.total / orderCount
      : 0;

  const totalRevenue = revenueAll._sum.total ?? 0;
  const revenueTodayVal = revenueToday._sum.total ?? 0;
  const revenueWeekVal = revenueThisWeek._sum.total ?? 0;
  const revenueMonthVal = revenueThisMonth._sum.total ?? 0;

  return (
    <AdminPageShell title="Dashboard" description="Overview of your store and sales">
      {/* Revenue & sales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard
          href="/admin/orders"
          label="Total revenue"
          value={formatPrice(totalRevenue)}
          icon={PoundSterling}
        />
        <MetricCard
          href="/admin/orders"
          label="Today"
          value={formatPrice(revenueTodayVal)}
          sub={`${ordersToday} orders`}
          icon={TrendingUp}
        />
        <MetricCard
          href="/admin/orders"
          label="This week"
          value={formatPrice(revenueWeekVal)}
          sub={`${ordersThisWeek} orders`}
          icon={TrendingUp}
        />
        <MetricCard
          href="/admin/orders"
          label="This month"
          value={formatPrice(revenueMonthVal)}
          sub={`${ordersThisMonth} orders`}
          icon={TrendingUp}
        />
        <MetricCard
          href="/admin/orders"
          label="Total orders"
          value={orderCount}
          icon={ShoppingBag}
        />
        <MetricCard
          href="/admin/orders"
          label="Units sold"
          value={totalUnitsSold}
          sub={orderCount > 0 ? `Avg order ${formatPrice(avgOrderValue)}` : undefined}
          icon={Package}
        />
      </div>

      {/* Catalog & content metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          href="/admin/products"
          label="Products"
          value={productCount}
          sub={`${activeProductCount} active · ${featuredCount} featured · ${bestSellerCount} bestseller`}
          icon={Package}
        />
        <MetricCard
          href="/admin/categories"
          label="Collections"
          value={categoryCount}
          sub={`${activeCategoryCount} active`}
          icon={FolderOpen}
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
          label="Banners & Promos"
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
        <MetricCard
          href="/admin/media"
          label="Media library"
          value={mediaAssetCount}
          icon={ImageIcon}
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
              Add collection
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

      {/* Best sellers */}
      {bestSellingProducts.length > 0 && (
        <div className="rounded-xl border border-sand-200 bg-white p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-premium-brown">Best sellers</h3>
            <Link href="/admin/orders" className="text-sm text-premium-taupe hover:text-premium-brown">
              View orders
            </Link>
          </div>
          <ul className="space-y-3">
            {top10ProductIds
              .map((id) => bestSellingProducts.find((p) => p.id === id))
              .filter(Boolean)
              .map((p, i) => (
                <li key={p!.id}>
                  <Link
                    href={`/admin/products/${p!.id}`}
                    className="flex items-center justify-between text-sm hover:underline"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-premium-taupe w-5">#{i + 1}</span>
                      {p!.images[0] ? (
                        <span className="relative w-8 h-8 rounded overflow-hidden bg-premium-soft flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p!.images[0].url} alt="" className="object-cover w-full h-full" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded bg-premium-soft flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-3 w-3 text-premium-taupe" aria-hidden />
                        </span>
                      )}
                      <span className="text-premium-brown truncate max-w-[180px]">{p!.title}</span>
                    </span>
                    <span className="font-medium text-premium-brown">{soldByProductId[p!.id] ?? 0} sold</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Recent orders & latest products */}
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
  value: number | string;
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

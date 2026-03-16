import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getContentBlock } from "@/lib/content";
import { HeroSection } from "@/components/storefront/HeroSection";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { PremiumProductCard } from "@/components/storefront/PremiumProductCard";
import { PremiumBanner } from "@/components/storefront/PremiumBanner";
import { SectionReveal } from "@/components/storefront/SectionReveal";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { sortOrder: "asc" },
  });
}

async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const [products, categories, heroTitle, heroSubtitle, heroButton, heroImage, heroSlides] =
    await Promise.all([
      getFeaturedProducts(),
      getActiveCategories(),
      getContentBlock("hero_title"),
      getContentBlock("hero_subtitle"),
      getContentBlock("hero_button"),
      getContentBlock("hero_image"),
      getContentBlock("hero_slides"),
    ]);

  const heroImageUrls =
    heroSlides
      ? heroSlides
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : heroImage
        ? [heroImage]
        : [];

  return (
    <div>
      <HeroSection
        imageUrls={heroImageUrls}
        title={heroTitle || "Personalised cards, sent with love"}
        subtitle={
          heroSubtitle ||
          "Beautiful greeting cards for every occasion—birthday, anniversary, wedding, and more. Each one thoughtfully designed and made to order."
        }
        cta={heroButton || "Shop All Cards"}
      />

      <TrustStrip />

      {categories.length > 0 && (
        <SectionReveal className="py-16 md:py-24 px-4 bg-premium-bg">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-premium-brown mb-10 text-center tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Shop by occasion
            </h2>
            <CategoryGrid categories={categories} />
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">View all occasions</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>
      )}

      <SectionReveal className="py-16 md:py-24 px-4 bg-premium-soft/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-premium-brown mb-10 text-center tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Featured cards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {products.map((product) => (
              <PremiumProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-center text-premium-taupe py-16">
              No featured products yet. Add some in the admin.
            </p>
          )}
          <div className="text-center mt-14">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View All Cards</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>

      <PremiumBanner
        eyebrow="Seasonal"
        title="Christmas cards"
        subtitle="Find the perfect festive greeting for everyone on your list."
        cta="Shop Christmas"
        ctaHref="/shop?occasion=christmas"
      />

      <HowItWorks />

      <SectionReveal className="py-20 md:py-24 px-4 bg-premium-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-premium-brown mb-4 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Made with care, sent with love
          </h2>
          <p className="text-premium-taupe leading-relaxed mb-8">
            Every card is printed on premium paper and personalised just for you.
            Perfect for birthdays, anniversaries, weddings, and all of
            life&apos;s special moments.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/about">Our story</Link>
          </Button>
        </div>
      </SectionReveal>

      <SectionReveal className="py-16 md:py-20 px-4 bg-premium-soft/50">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-serif text-xl text-premium-brown mb-2 tracking-tight">
            Join us for new designs and offers
          </p>
          <p className="text-sm text-premium-taupe mb-6">
            Be the first to know when we launch new cards.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent"
            />
            <Button type="submit">Sign up</Button>
          </form>
        </div>
      </SectionReveal>
    </div>
  );
}

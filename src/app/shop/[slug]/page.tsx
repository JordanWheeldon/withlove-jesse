import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PersonalisationForm } from "@/components/shop/PersonalisationForm";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  if (!product) return {};
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription || undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { images: true, category: true },
  });

  if (!product) notFound();

  const mainImage = product.images.find((i) => i.isMain) || product.images[0];
  const galleryImages = product.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((i) => !i.isMain || product.images.length === 1);
  const price = product.salePrice ? Number(product.salePrice) : Number(product.price);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <nav className="text-sm text-premium-taupe mb-10">
        <Link href="/shop" className="hover:text-premium-brown">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?occasion=${product.category.slug}`} className="hover:text-premium-brown">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-premium-brown">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-premium-soft rounded-2xl overflow-hidden relative shadow-soft">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-premium-taupe/50">
                No image
              </div>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-premium-soft"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.title}
                    width={80}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-premium-taupe text-sm mb-2 uppercase tracking-wider">{product.category.name}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-premium-brown mb-4 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-medium text-premium-brown">
              {formatPrice(price)}
            </span>
            {product.salePrice && (
              <span className="text-premium-taupe line-through">
                {formatPrice(Number(product.price))}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-premium-taupe mb-6">{product.shortDescription}</p>
          )}

          {product.fullDescription && (
            <div
              className="text-premium-taupe mb-8 prose max-w-none prose-p:text-premium-taupe"
              dangerouslySetInnerHTML={{ __html: product.fullDescription }}
            />
          )}

          {product.personalisationEnabled ? (
            <PersonalisationForm
              product={product}
              recipientNameLimit={product.recipientNameLimit}
              messageLimit={product.messageLimit}
              insideMessageLimit={product.insideMessageLimit}
              senderNameLimit={product.senderNameLimit}
              instructions={product.personalisationInstructions}
            />
          ) : (
            <AddToCartButton product={product} />
          )}

          <div className="mt-8 pt-8 border-t border-sand-200 space-y-2">
            <h3 className="font-medium text-premium-brown text-sm uppercase tracking-wider">
              Personalisation & delivery
            </h3>
            <p className="text-sm text-premium-taupe leading-relaxed">
              {product.personalisationInstructions ||
                "Add your personal message at checkout. Cards are printed to order and shipped within 3-5 working days."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductImage, Category } from "@prisma/client";

type ProductWithMeta = Product & { images: ProductImage[]; category: Category };

const CYCLE_INTERVAL_MS = 2400;

export function PremiumProductCard({ product }: { product: ProductWithMeta }) {
  const images = product.images.length
    ? [...product.images].sort((a, b) => (a.isMain ? 0 : 1) - (b.isMain ? 0 : 1))
    : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const price = product.salePrice ? Number(product.salePrice) : Number(product.price);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || images.length <= 1) return;
    const id = setInterval(nextImage, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isHovering, images.length, nextImage]);

  const currentImage = images[activeIndex] || images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setActiveIndex(0);
        }}
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-premium-soft shadow-soft group-hover:shadow-lift transition-all duration-500">
          {images.length > 0 ? (
            images.map((img, idx) => (
              <div
                key={img.id}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{
                  opacity: idx === activeIndex ? 1 : 0,
                  zIndex: idx === activeIndex ? 1 : 0,
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt || product.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-premium-taupe/50 text-sm">
              No image
            </div>
          )}
          {product.salePrice && (
            <span className="absolute top-3 left-3 bg-premium-brown text-white text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
          {(product.isNewArrival || product.isBestSeller) && (
            <span className="absolute top-3 right-3 bg-white/95 text-premium-brown text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.isNewArrival ? "New" : "Bestseller"}
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs text-premium-taupe uppercase tracking-widest">
            {product.category.name}
          </p>
          <h3 className="font-serif text-lg text-premium-brown group-hover:text-premium-black transition-colors leading-snug">
            {product.title}
          </h3>
          <p className="pt-1 font-medium text-premium-brown">
            {formatPrice(price)}
            {product.salePrice && (
              <span className="text-premium-taupe/80 line-through text-sm ml-2">
                {formatPrice(Number(product.price))}
              </span>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=80";

export function HeroSection({
  imageUrl,
  title,
  subtitle,
  cta,
}: {
  imageUrl?: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  const src = imageUrl || FALLBACK_IMAGE;
  return (
    <section className="relative min-h-[55vh] md:min-h-[60vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-premium-brown/50 via-premium-brown/25 to-transparent"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.12] mb-4 drop-shadow-sm"
          style={{ letterSpacing: "-0.03em" }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-base md:text-lg text-white/95 mb-8 max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-premium-brown hover:bg-white/95 hover:text-premium-black shadow-lift transition-all duration-300 rounded-full px-8"
          >
            <Link href="/shop">{cta}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

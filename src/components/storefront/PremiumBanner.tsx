"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function PremiumBanner({
  title,
  subtitle,
  cta,
  ctaHref = "/shop",
  image,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
  image?: string;
  eyebrow?: string;
}) {
  const bgImage =
    image ||
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=80";

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={bgImage} alt="" fill className="object-cover" sizes="100vw" />
        <div
          className="absolute inset-0 bg-premium-brown/50"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.2em] text-white/90 mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/95 text-lg mb-8"
          >
            {subtitle}
          </motion.p>
        )}
        {cta && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-premium-brown hover:bg-premium-soft"
            >
              <Link href={ctaHref}>{cta}</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

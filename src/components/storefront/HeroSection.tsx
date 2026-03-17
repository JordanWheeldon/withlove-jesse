"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=80";
const ROTATE_MS = 5500;
const SWIPE_THRESHOLD = 50;

export function HeroSection({
  imageUrls = [],
  title,
  subtitle,
  cta,
}: {
  imageUrls?: string[];
  title: string;
  subtitle: string;
  cta: string;
}) {
  const slides = imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE];
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex((prev) => (i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const x = useMotionValue(0);
  useEffect(() => {
    x.set(0);
  }, [index, x]);
  const opacity = useTransform(x, [-120, 0, 120], [0.4, 1, 0.4]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (slides.length <= 1) return;
      if (info.offset.x > SWIPE_THRESHOLD) goTo(index - 1);
      else if (info.offset.x < -SWIPE_THRESHOLD) goTo(index + 1);
    },
    [index, goTo, slides.length]
  );

  const current = slides[index];

  return (
    <section className="relative min-h-[38vh] md:min-h-[42vh] flex items-center overflow-hidden">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            drag={slides.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: slides.length > 1 ? x : undefined, opacity: slides.length > 1 ? opacity : undefined }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 touch-pan-y"
          >
            <Image
              src={current}
              alt=""
              fill
              priority={index === 0}
              className="object-cover object-center pointer-events-none"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div
          className="absolute inset-0 bg-gradient-to-r from-premium-brown/50 via-premium-brown/25 to-transparent"
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-12 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-[1.15] mb-3 drop-shadow-sm"
          style={{ letterSpacing: "-0.03em" }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm md:text-base text-white/95 mb-6 max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-premium-brown hover:bg-white/95 hover:text-premium-black shadow-lift transition-all duration-300 rounded-full px-8"
          >
            <Link href="/shop">{cta}</Link>
          </Button>
          {slides.length > 1 && (
            <div className="flex items-center gap-2" aria-label="Hero slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    i === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

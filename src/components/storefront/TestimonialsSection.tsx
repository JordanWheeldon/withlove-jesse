"use client";

import { motion } from "framer-motion";

const DEFAULT_TESTIMONIALS = [
  { quote: "Beautiful quality and the personalisation made it so special. Will definitely order again.", author: "— Sarah, London" },
  { quote: "The cards arrived quickly and looked even better than on screen. Perfect for my mum's birthday.", author: "— Emma" },
  { quote: "Lovely designs and the paper feels really premium. Exactly what I was looking for.", author: "— James" },
];

export function TestimonialsSection({ content }: { content: string | null }) {
  const items = content
    ? content
        .split(/\r?\n/)
        .map((line) => {
          const parts = line.split("|").map((s) => s.trim());
          return parts.length >= 2 ? { quote: parts[0], author: parts[1] } : null;
        })
        .filter(Boolean) as { quote: string; author: string }[]
    : DEFAULT_TESTIMONIALS;

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-premium-bg">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-3xl text-premium-brown text-center mb-12 tracking-tight"
        >
          What our customers say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-sand-200 bg-white p-6 shadow-soft"
            >
              <p className="text-premium-taupe leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
              <footer className="text-sm text-premium-brown font-medium">{item.author}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const DEFAULT_ITEMS = [
  { title: "Premium cardstock", description: "Printed on quality paper that feels as good as it looks." },
  { title: "Made to order", description: "Each card is personalised and printed just for you." },
  { title: "Designed with love", description: "Thoughtful designs for every occasion." },
  { title: "UK dispatch", description: "Carefully packed and sent within 5 working days." },
];

export function WhyChooseUsSection({ content }: { content: string | null }) {
  const items = content
    ? content
        .split(/\r?\n/)
        .map((line) => {
          const parts = line.split("|").map((s) => s.trim());
          return parts.length >= 2 ? { title: parts[0], description: parts[1] } : null;
        })
        .filter(Boolean) as { title: string; description: string }[]
    : DEFAULT_ITEMS;

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-white border-y border-sand-200/80">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-3xl text-premium-brown text-center mb-12 tracking-tight"
        >
          Why choose us
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.slice(0, 4).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <h3 className="font-serif text-lg text-premium-brown mb-2">{item.title}</h3>
              <p className="text-sm text-premium-taupe leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

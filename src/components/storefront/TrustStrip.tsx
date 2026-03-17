"use client";

import { motion } from "framer-motion";

const items = [
  { label: "Printed on premium cardstock" },
  { label: "Made to order" },
  { label: "Personalised with care" },
  { label: "UK dispatch within 5 days" },
];

export function TrustStrip() {
  return (
    <section className="py-8 px-4 border-y border-sand-200/80 bg-white/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-premium-taupe">
          {items.map((item, i) => (
            <motion.span
              key={item.label}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-premium-accent" />
              {item.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

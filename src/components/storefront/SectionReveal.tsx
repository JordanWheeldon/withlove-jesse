"use client";

import { motion } from "framer-motion";

const defaultReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export function SectionReveal({
  children,
  className,
  delay = 0,
  ...props
}: React.ComponentProps<typeof motion.section> & { delay?: number }) {
  return (
    <motion.section
      initial={defaultReveal.initial}
      whileInView={defaultReveal.whileInView}
      viewport={defaultReveal.viewport}
      transition={{ ...defaultReveal.transition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

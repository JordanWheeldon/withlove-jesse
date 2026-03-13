"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Choose your card",
    description: "Browse our collection and find the perfect design for your occasion.",
  },
  {
    number: "2",
    title: "Personalise your wording",
    description: "Add the recipient's name and your own message. We'll print it beautifully.",
  },
  {
    number: "3",
    title: "We print and send with love",
    description: "Each card is made to order on premium paper and dispatched with care.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 bg-premium-soft/50">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl md:text-3xl text-premium-brown text-center mb-16"
        >
          How it works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-premium-accent flex items-center justify-center text-premium-brown font-serif text-lg font-medium mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-serif text-xl text-premium-brown mb-2">
                {step.title}
              </h3>
              <p className="text-premium-taupe text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROTATE_MS = 5000;

export function AnnouncementMarquee({ messages }: { messages: string[] }) {
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [messages.length, paused]);

  if (messages.length === 0) return null;

  return (
    <div
      className="bg-premium-brown text-white text-center py-2.5 px-4 text-sm min-h-[44px] flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {messages.length === 1 ? (
        <span>{messages[0]}</span>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}

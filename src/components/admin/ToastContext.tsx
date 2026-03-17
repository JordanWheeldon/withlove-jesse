"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Toast = { id: number; message: string; type?: "success" | "error" };
type ToastContextValue = { toast: (message: string, type?: "success" | "error") => void };

const ToastContext = createContext<ToastContextValue | null>(null);

let id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const nextId = ++id;
    setToasts((prev) => [...prev, { id: nextId, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== nextId)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`pointer-events-auto rounded-lg px-4 py-3 shadow-lift text-sm font-medium ${
                t.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-premium-brown text-white"
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { toast: () => {} };
}

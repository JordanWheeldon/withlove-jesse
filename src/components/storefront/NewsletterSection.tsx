"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage(data.message || "Thanks for signing up.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  return (
    <section className="py-16 md:py-20 px-4 bg-premium-soft/50">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-serif text-xl text-premium-brown mb-2 tracking-tight">
          Join us for new designs and offers
        </p>
        <p className="text-sm text-premium-taupe mb-6">
          Be the first to know when we launch new cards.
        </p>
        {status === "success" ? (
          <p className="text-green-700 font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent disabled:opacity-70"
              required
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Signing up…" : "Sign up"}
            </Button>
          </form>
        )}
        {status === "error" && message && (
          <p className="text-red-600 text-sm mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}

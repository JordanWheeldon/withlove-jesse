"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@prisma/client";

export function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        trackEvent("add_to_cart", { product_id: product.id, product_name: product.title });
        router.push("/cart");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      disabled={loading}
      onClick={handleAddToCart}
    >
      {loading ? "Adding..." : "Add to cart"}
    </Button>
  );
}

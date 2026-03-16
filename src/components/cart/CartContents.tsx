"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  personalisation?: {
    recipientName?: string;
    message?: string;
    insideMessage?: string;
    senderName?: string;
  };
};

export function CartContents() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.items || []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateQuantity(productId: string, quantity: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      setCart(data.items || []);
    }
  }

  if (loading) {
    return <p className="text-sand-500">Loading cart...</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sand-600 mb-4">Your cart is empty</p>
        <Button asChild>
          <Link href="/shop">Browse cards</Link>
        </Button>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="space-y-6">
      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex gap-4 p-4 rounded-xl border border-sand-200 bg-cream-50"
        >
          <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-sand-200">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={96}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sand-400 text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/shop/${item.slug}`}
              className="font-serif text-lg text-sand-800 hover:underline"
            >
              {item.title}
            </Link>
            {item.personalisation?.recipientName && (
              <p className="text-sm text-sand-500 mt-1">
                For: {item.personalisation.recipientName}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center border border-sand-300 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(0, item.quantity - 1))
                  }
                  className="px-3 py-1 text-sand-600 hover:bg-sand-100"
                >
                  −
                </button>
                <span className="px-4 py-1 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 text-sand-600 hover:bg-sand-100"
                >
                  +
                </button>
              </div>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-6 border-t border-sand-200">
        <div className="text-right">
          <p className="text-sm text-sand-500">Subtotal</p>
          <p className="text-xl font-medium text-sand-800">
            {formatPrice(subtotal)}
          </p>
          <Button asChild className="mt-4">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

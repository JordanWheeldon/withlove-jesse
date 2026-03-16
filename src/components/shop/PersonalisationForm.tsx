"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@prisma/client";

export function PersonalisationForm({
  product,
  recipientNameLimit,
  messageLimit,
  insideMessageLimit,
  senderNameLimit,
  instructions,
}: {
  product: Product;
  recipientNameLimit: number;
  messageLimit: number;
  insideMessageLimit: number;
  senderNameLimit: number;
  instructions: string | null;
}) {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [insideMessage, setInsideMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddToCart(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          personalisation: {
            recipientName: recipientName.slice(0, recipientNameLimit),
            message: message.slice(0, messageLimit),
            insideMessage: insideMessage.slice(0, insideMessageLimit),
            senderName: senderName.slice(0, senderNameLimit),
          },
        }),
      });
      if (res.ok) router.push("/cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAddToCart} className="space-y-6">
      {instructions && (
        <p className="text-sm text-sand-600 bg-sand-100/50 p-4 rounded-lg">
          {instructions}
        </p>
      )}

      <div>
        <Label htmlFor="recipientName">Recipient&apos;s name</Label>
        <Input
          id="recipientName"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          maxLength={recipientNameLimit}
          placeholder="e.g. Mum"
          className="mt-2"
        />
        <p className="text-xs text-sand-500 mt-1">
          {recipientName.length}/{recipientNameLimit} characters
        </p>
      </div>

      <div>
        <Label htmlFor="message">Your message (front)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={messageLimit}
          placeholder="Write your heartfelt message..."
          rows={4}
          className="mt-2"
        />
        <p className="text-xs text-sand-500 mt-1">
          {message.length}/{messageLimit} characters
        </p>
      </div>

      <div>
        <Label htmlFor="insideMessage">Inside message (optional)</Label>
        <Textarea
          id="insideMessage"
          value={insideMessage}
          onChange={(e) => setInsideMessage(e.target.value)}
          maxLength={insideMessageLimit}
          placeholder="Optional extra message for inside the card..."
          rows={3}
          className="mt-2"
        />
        <p className="text-xs text-sand-500 mt-1">
          {insideMessage.length}/{insideMessageLimit} characters
        </p>
      </div>

      <div>
        <Label htmlFor="senderName">From (optional)</Label>
        <Input
          id="senderName"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          maxLength={senderNameLimit}
          placeholder="e.g. Love, Sarah"
          className="mt-2"
        />
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}

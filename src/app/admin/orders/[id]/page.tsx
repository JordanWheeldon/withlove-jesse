import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const personalisation = order.personalisation
    ? (typeof order.personalisation === "string"
        ? JSON.parse(order.personalisation || "{}")
        : order.personalisation)
    : null;

  return (
    <AdminPageShell
      title={`Order ${order.orderNumber}`}
      description={format(order.createdAt, "dd MMM yyyy")}
      action={
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      }
    >
      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <h3 className="font-medium text-premium-brown mb-4">Customer</h3>
          <p>
            {order.firstName} {order.lastName}
          </p>
          <p className="text-premium-taupe">{order.email}</p>
          {order.phone && <p className="text-premium-taupe">{order.phone}</p>}
        </div>
        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <h3 className="font-medium text-premium-brown mb-4">Shipping address</h3>
          <p>{order.addressLine1}</p>
          {order.addressLine2 && <p>{order.addressLine2}</p>}
          <p>
            {order.city}
            {order.county ? `, ${order.county}` : ""} {order.postcode}
          </p>
          <p>{order.country}</p>
        </div>
        <div className="rounded-xl border border-sand-200 bg-white p-6">
          <h3 className="font-medium text-premium-brown mb-4">Items</h3>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.product.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-sand-200 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
        {order.notes && (
          <div className="rounded-xl border border-sand-200 bg-white p-6">
            <h3 className="font-medium text-premium-brown mb-2">Notes</h3>
            <p className="text-premium-taupe text-sm">{order.notes}</p>
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}

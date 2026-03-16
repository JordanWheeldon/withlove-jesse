import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminPageShell
      title="Orders"
      description="View and manage customer orders."
    >
      {orders.length === 0 ? (
        <AdminEmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Orders will appear here when customers complete checkout."
        />
      ) : (
        <div className="rounded-xl border border-sand-200 overflow-hidden bg-white shadow-soft">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand-200 bg-premium-soft/50">
                <th className="text-left p-4 font-medium text-premium-brown">Order</th>
                <th className="text-left p-4 font-medium text-premium-brown">Date</th>
                <th className="text-left p-4 font-medium text-premium-brown">Customer</th>
                <th className="text-left p-4 font-medium text-premium-brown">Total</th>
                <th className="text-left p-4 font-medium text-premium-brown">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-sand-100 hover:bg-premium-bg/50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm text-premium-brown hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4 text-premium-taupe text-sm">{format(o.createdAt, "dd MMM yyyy")}</td>
                  <td className="p-4 text-premium-brown">{o.firstName} {o.lastName}</td>
                  <td className="p-4 font-medium text-premium-brown">{formatPrice(Number(o.total))}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-premium-soft text-premium-taupe">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageShell>
  );
}

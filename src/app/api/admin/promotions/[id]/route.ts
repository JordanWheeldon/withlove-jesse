import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await request.json();
  const update: Record<string, unknown> = {};
  const keys = [
    "title", "description", "code", "discountType", "discountValue",
    "startsAt", "endsAt", "isActive",
    "bannerTitle", "bannerSubtitle", "bannerCta", "bannerLink", "bannerImage", "location",
  ];
  for (const k of keys) {
    if (body[k] !== undefined) {
      if (k === "startsAt" || k === "endsAt") update[k] = body[k] ? new Date(body[k]) : null;
      else update[k] = body[k];
    }
  }

  const promotion = await prisma.promotion.update({
    where: { id },
    data: update,
  });
  return NextResponse.json(promotion);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

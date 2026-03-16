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
  if (body.label !== undefined) update.label = body.label;
  if (body.href !== undefined) update.href = body.href;
  if (body.sortOrder !== undefined) update.sortOrder = body.sortOrder;
  if (body.location !== undefined) update.location = body.location;

  const item = await prisma.navigationItem.update({
    where: { id },
    data: update,
  });
  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.navigationItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

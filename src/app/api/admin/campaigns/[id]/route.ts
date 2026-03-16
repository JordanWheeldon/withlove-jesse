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
  if (body.name !== undefined) update.name = body.name;
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.isActive !== undefined) update.isActive = body.isActive;
  if (body.isFeatured !== undefined) update.isFeatured = body.isFeatured;
  if (body.startsAt !== undefined) update.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (body.endsAt !== undefined) update.endsAt = body.endsAt ? new Date(body.endsAt) : null;
  if (body.bannerTitle !== undefined) update.bannerTitle = body.bannerTitle;
  if (body.bannerSubtitle !== undefined) update.bannerSubtitle = body.bannerSubtitle;
  if (body.bannerCta !== undefined) update.bannerCta = body.bannerCta;
  if (body.bannerImage !== undefined) update.bannerImage = body.bannerImage;
  if (body.homepageOrder !== undefined) update.homepageOrder = body.homepageOrder;

  const campaign = await prisma.seasonalCampaign.update({
    where: { id },
    data: update,
  });
  return NextResponse.json(campaign);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.seasonalCampaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

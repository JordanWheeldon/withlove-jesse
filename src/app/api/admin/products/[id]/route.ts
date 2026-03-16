import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const body = await request.json();
  const {
    title,
    slug,
    shortDescription,
    fullDescription,
    price,
    salePrice,
    categoryId,
    isActive,
    isFeatured,
    isNewArrival,
    isBestSeller,
    personalisationEnabled,
    personalisationInstructions,
    recipientNameLimit,
    messageLimit,
    insideMessageLimit,
    senderNameLimit,
    mainImageUrl,
    seoTitle,
    seoDescription,
  } = body;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  if (title !== undefined) update.title = title;
  if (slug !== undefined) update.slug = slug;
  if (shortDescription !== undefined) update.shortDescription = shortDescription;
  if (fullDescription !== undefined) update.fullDescription = fullDescription;
  if (price !== undefined) update.price = parseFloat(price);
  if (salePrice !== undefined)
    update.salePrice = salePrice ? parseFloat(salePrice) : null;
  if (categoryId !== undefined) update.categoryId = categoryId;
  if (isActive !== undefined) update.isActive = !!isActive;
  if (isFeatured !== undefined) update.isFeatured = !!isFeatured;
  if (isNewArrival !== undefined) update.isNewArrival = !!isNewArrival;
  if (isBestSeller !== undefined) update.isBestSeller = !!isBestSeller;
  if (personalisationEnabled !== undefined)
    update.personalisationEnabled = personalisationEnabled;
  if (personalisationInstructions !== undefined)
    update.personalisationInstructions = personalisationInstructions;
  if (recipientNameLimit !== undefined)
    update.recipientNameLimit = recipientNameLimit ?? 30;
  if (messageLimit !== undefined) update.messageLimit = messageLimit ?? 200;
  if (insideMessageLimit !== undefined)
    update.insideMessageLimit = insideMessageLimit ?? 100;
  if (senderNameLimit !== undefined)
    update.senderNameLimit = senderNameLimit ?? 30;
  if (seoTitle !== undefined) update.seoTitle = seoTitle;
  if (seoDescription !== undefined) update.seoDescription = seoDescription;

  await prisma.product.update({
    where: { id },
    data: update,
  });

  if (mainImageUrl) {
    const mainImg = product.images.find((i) => i.isMain);
    if (mainImg) {
      await prisma.productImage.update({
        where: { id: mainImg.id },
        data: { url: mainImageUrl },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: mainImageUrl,
          alt: title || product.title,
          isMain: true,
          sortOrder: 0,
        },
      });
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

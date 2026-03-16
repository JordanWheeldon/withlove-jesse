import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    galleryUrls,
    seoTitle,
    seoDescription,
  } = body;

  if (!title || !categoryId || price == null) {
    return NextResponse.json(
      { error: "Title, category, and price required" },
      { status: 400 }
    );
  }

  const productSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const product = await prisma.product.create({
    data: {
      title,
      slug: productSlug,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      categoryId,
      isActive: !!isActive,
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
      personalisationEnabled: personalisationEnabled !== false,
      personalisationInstructions: personalisationInstructions || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      recipientNameLimit: recipientNameLimit ?? 30,
      messageLimit: messageLimit ?? 200,
      insideMessageLimit: insideMessageLimit ?? 100,
      senderNameLimit: senderNameLimit ?? 30,
      madeToOrder: true,
    },
  });

  if (mainImageUrl) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: mainImageUrl,
        alt: title,
        isMain: true,
        sortOrder: 0,
      },
    });
  }

  const urls = Array.isArray(galleryUrls) ? galleryUrls.filter((u) => typeof u === "string" && u.trim()) : [];
  for (let i = 0; i < urls.length; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: urls[i].trim(),
        alt: title,
        isMain: false,
        sortOrder: i + 1,
      },
    });
  }

  return NextResponse.json(product);
}

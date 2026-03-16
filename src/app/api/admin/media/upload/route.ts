import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const MAX_SIZE_LOCAL = 10 * 1024 * 1024; // 10MB for local
const MAX_SIZE_BLOB = 4 * 1024 * 1024; // 4MB on live site

// Allow up to 60s so cold start + Blob upload can complete (Vercel Pro; Hobby may cap lower)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isVercel = process.env.VERCEL === "1";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const useBlob = !!blobToken;

    // On Vercel we must use Blob; fail before reading the request body
    if (isVercel && !blobToken) {
      return NextResponse.json(
        {
          error:
            "Uploads are disabled: add BLOB_READ_WRITE_TOKEN in Vercel → Settings → Environment Variables, then redeploy.",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, JPEG, JPG, PDF" },
        { status: 400 }
      );
    }

    const maxSize = useBlob ? MAX_SIZE_BLOB : MAX_SIZE_LOCAL;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: useBlob
            ? "File too large. Maximum 4MB for uploads on the live site."
            : "File too large. Maximum 10MB",
        },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    let url: string;

    if (useBlob) {
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      url = blob.url;
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filepath = path.join(uploadDir, path.basename(filename));
      await writeFile(filepath, buffer);
      url = `/uploads/${path.basename(filename)}`;
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({
      url,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      id: asset.id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed. Try the Media Library page or use an image URL." },
      { status: 500 }
    );
  }
}

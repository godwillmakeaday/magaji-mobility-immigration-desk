import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only accept URLs that live in our own Vercel Blob store — never an arbitrary
// external URL supplied by a caller.
function isBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    reviewId?: string;
    riskCheckId?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    storageUrl?: string;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { reviewId, riskCheckId, fileName, fileType, fileSize, storageUrl, note } =
    body;

  if (!fileName || !storageUrl) {
    return NextResponse.json(
      { error: "fileName and storageUrl are required." },
      { status: 400 }
    );
  }
  if (!isBlobUrl(storageUrl)) {
    return NextResponse.json({ error: "Invalid storage URL." }, { status: 400 });
  }
  // Exactly one owner.
  if ((reviewId ? 1 : 0) + (riskCheckId ? 1 : 0) !== 1) {
    return NextResponse.json(
      { error: "A document must belong to exactly one matter." },
      { status: 400 }
    );
  }

  try {
    const doc = await prisma.documentRecord.create({
      data: {
        fileName,
        fileType: fileType ?? null,
        fileSize: typeof fileSize === "number" ? fileSize : null,
        storageUrl,
        reviewId: reviewId ?? null,
        riskCheckId: riskCheckId ?? null,
        note: note?.trim() || null,
      },
    });
    await recordAudit({
      action: "DOCUMENT_UPLOADED",
      actorId: admin.id,
      actorEmail: admin.email,
      targetType: reviewId ? "MobilityReview" : "RiskCheck",
      targetId: reviewId ?? riskCheckId ?? null,
      detail: fileName,
    });
    return NextResponse.json({ ok: true, document: doc }, { status: 201 });
  } catch (err) {
    console.error("Failed to create document record:", err);
    return NextResponse.json(
      { error: "Could not save the document." },
      { status: 500 }
    );
  }
}

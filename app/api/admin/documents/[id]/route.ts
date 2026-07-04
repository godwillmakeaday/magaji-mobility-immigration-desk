import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const doc = await prisma.documentRecord.findUnique({
      where: { id: params.id },
    });
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    // Best-effort removal of the underlying blob; never let it block the
    // record deletion.
    if (doc.storageUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(doc.storageUrl);
      } catch (e) {
        console.error("Failed to delete blob (continuing):", e);
      }
    }

    await prisma.documentRecord.delete({ where: { id: params.id } });
    await recordAudit({
      action: "DOCUMENT_DELETED",
      actorId: admin.id,
      actorEmail: admin.email,
      targetType: doc.reviewId ? "MobilityReview" : "RiskCheck",
      targetId: doc.reviewId ?? doc.riskCheckId ?? null,
      detail: doc.fileName,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete document:", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}

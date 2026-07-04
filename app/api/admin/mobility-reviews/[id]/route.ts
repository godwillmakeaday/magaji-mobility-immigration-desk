import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { REVIEW_STATUS_OPTIONS, REVIEW_STATUS_LABEL } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { status?: string; internalNote?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = await prisma.mobilityReview.findUnique({
    where: { id: params.id },
    select: { status: true, internalNote: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const data: { status?: string; internalNote?: string | null } = {};
  if (body.status !== undefined) {
    if (!(REVIEW_STATUS_OPTIONS as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.internalNote !== undefined) {
    data.internalNote = body.internalNote.trim() || null;
  }

  try {
    const updated = await prisma.mobilityReview.update({
      where: { id: params.id },
      data: data as never,
    });

    if (data.status && data.status !== existing.status) {
      await recordAudit({
        action: "REVIEW_STATUS_CHANGED",
        actorId: admin.id,
        actorEmail: admin.email,
        targetType: "MobilityReview",
        targetId: params.id,
        detail: `${REVIEW_STATUS_LABEL[existing.status] ?? existing.status} → ${
          REVIEW_STATUS_LABEL[data.status] ?? data.status
        }`,
      });
    }
    if (
      data.internalNote !== undefined &&
      (data.internalNote ?? "") !== (existing.internalNote ?? "")
    ) {
      await recordAudit({
        action: "REVIEW_NOTE_CHANGED",
        actorId: admin.id,
        actorEmail: admin.email,
        targetType: "MobilityReview",
        targetId: params.id,
      });
    }

    return NextResponse.json({ ok: true, review: updated });
  } catch (err) {
    console.error("Failed to update mobility review:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

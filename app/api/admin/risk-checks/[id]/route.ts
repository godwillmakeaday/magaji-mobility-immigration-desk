import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { RISK_STATUS_OPTIONS, RISK_STATUS_LABEL } from "@/lib/enums";

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

  const existing = await prisma.riskCheck.findUnique({
    where: { id: params.id },
    select: { status: true, internalNote: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const data: { status?: string; internalNote?: string | null } = {};
  if (body.status !== undefined) {
    if (!(RISK_STATUS_OPTIONS as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.internalNote !== undefined) {
    data.internalNote = body.internalNote.trim() || null;
  }

  try {
    const updated = await prisma.riskCheck.update({
      where: { id: params.id },
      data: data as never,
    });

    if (data.status && data.status !== existing.status) {
      await recordAudit({
        action: "RISK_STATUS_CHANGED",
        actorId: admin.id,
        actorEmail: admin.email,
        targetType: "RiskCheck",
        targetId: params.id,
        detail: `${RISK_STATUS_LABEL[existing.status] ?? existing.status} → ${
          RISK_STATUS_LABEL[data.status] ?? data.status
        }`,
      });
    }
    if (
      data.internalNote !== undefined &&
      (data.internalNote ?? "") !== (existing.internalNote ?? "")
    ) {
      await recordAudit({
        action: "RISK_NOTE_CHANGED",
        actorId: admin.id,
        actorEmail: admin.email,
        targetType: "RiskCheck",
        targetId: params.id,
      });
    }

    return NextResponse.json({ ok: true, riskCheck: updated });
  } catch (err) {
    console.error("Failed to update risk check:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

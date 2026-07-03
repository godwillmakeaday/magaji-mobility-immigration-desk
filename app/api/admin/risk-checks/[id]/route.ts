import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { RISK_STATUS_OPTIONS } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { status?: string; internalNote?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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
    return NextResponse.json({ ok: true, riskCheck: updated });
  } catch (err) {
    console.error("Failed to update risk check:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

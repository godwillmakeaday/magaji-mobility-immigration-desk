import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ADMIN_ROLE_OPTIONS } from "@/lib/enums";

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
  if (admin.role !== "OWNER") {
    return NextResponse.json(
      { error: "Only an owner can manage users." },
      { status: 403 }
    );
  }

  let body: { disabled?: boolean; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({
    where: { id: params.id },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (target.id === admin.id) {
    return NextResponse.json(
      { error: "You cannot change your own account." },
      { status: 400 }
    );
  }

  // Guard: never leave the system without at least one active owner.
  async function activeOwnerCountExcluding(id: string): Promise<number> {
    return prisma.adminUser.count({
      where: { role: "OWNER", disabled: false, id: { not: id } },
    });
  }

  const data: { disabled?: boolean; role?: string } = {};
  const audits: { action: string; detail?: string }[] = [];

  if (body.role !== undefined) {
    if (!(ADMIN_ROLE_OPTIONS as readonly string[]).includes(body.role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (
      target.role === "OWNER" &&
      body.role !== "OWNER" &&
      (await activeOwnerCountExcluding(target.id)) === 0
    ) {
      return NextResponse.json(
        { error: "There must be at least one active owner." },
        { status: 400 }
      );
    }
    if (body.role !== target.role) {
      data.role = body.role;
      audits.push({
        action: "USER_ROLE_CHANGED",
        detail: `${target.email}: ${target.role} → ${body.role}`,
      });
    }
  }

  if (body.disabled !== undefined && body.disabled !== target.disabled) {
    if (
      body.disabled &&
      target.role === "OWNER" &&
      (await activeOwnerCountExcluding(target.id)) === 0
    ) {
      return NextResponse.json(
        { error: "There must be at least one active owner." },
        { status: 400 }
      );
    }
    data.disabled = body.disabled;
    audits.push({
      action: body.disabled ? "USER_DISABLED" : "USER_ENABLED",
      detail: target.email,
    });
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: true });
  }

  await prisma.adminUser.update({
    where: { id: target.id },
    data: data as never,
  });

  for (const a of audits) {
    await recordAudit({
      action: a.action,
      actorId: admin.id,
      actorEmail: admin.email,
      targetType: "AdminUser",
      targetId: target.id,
      detail: a.detail,
    });
  }

  return NextResponse.json({ ok: true });
}

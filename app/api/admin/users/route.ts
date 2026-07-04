import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { recordAudit } from "@/lib/audit";
import { ADMIN_ROLE_OPTIONS } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
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

  let body: { email?: string; name?: string; role?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();
  const role = body.role ?? "STAFF";
  const password = body.password ?? "";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!EMAIL_RE.test(email)) errors.email = "Valid email is required.";
  if (password.length < 10)
    errors.password = "Password must be at least 10 characters.";
  if (!(ADMIN_ROLE_OPTIONS as readonly string[]).includes(role))
    errors.role = "Invalid role.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { errors: { email: "A user with this email already exists." } },
      { status: 409 }
    );
  }

  const user = await prisma.adminUser.create({
    data: {
      email,
      name,
      role: role as never,
      passwordHash: hashPassword(password),
    },
    select: { id: true, email: true, name: true, role: true },
  });

  await recordAudit({
    action: "USER_CREATED",
    actorId: admin.id,
    actorEmail: admin.email,
    targetType: "AdminUser",
    targetId: user.id,
    detail: `${user.email} (${user.role})`,
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}

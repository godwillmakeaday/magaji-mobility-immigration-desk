import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authConfigured, signSession, setSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A valid scrypt hash of a random value, used to equalise timing when the email
// is not found (so the response time doesn't reveal whether an account exists).
const DUMMY_HASH =
  "scrypt:16384:8:1:AAAAAAAAAAAAAAAAAAAAAA==:" +
  "Ymrs2wJbT0h0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yh0Yg==";

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const user = email
    ? await prisma.adminUser.findUnique({ where: { email } })
    : null;

  // Always run a verification to keep timing uniform.
  const pwOk = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  const ok = !!user && !user.disabled && pwOk;

  if (!ok) {
    await recordAudit({
      action: "LOGIN_FAILURE",
      actorEmail: email || null,
      detail: user?.disabled ? "Account disabled" : "Invalid credentials",
    });
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const token = signSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "OWNER" | "STAFF",
  });
  if (!token) {
    return NextResponse.json(
      { error: "Authentication is not configured on the server." },
      { status: 500 }
    );
  }

  setSessionCookie(token);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await recordAudit({
    action: "LOGIN_SUCCESS",
    actorId: user.id,
    actorEmail: user.email,
  });

  return NextResponse.json({ ok: true, name: user.name, role: user.role });
}

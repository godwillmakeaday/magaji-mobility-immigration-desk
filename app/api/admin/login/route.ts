import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, issueToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin access is not configured on the server." },
      { status: 500 }
    );
  }

  const token = issueToken(body.password ?? "");
  if (!token) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return NextResponse.json({ ok: true });
}

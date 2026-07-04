import { NextResponse } from "next/server";
import { clearSessionCookie, readSessionClaims } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const claims = readSessionClaims();
  if (claims) {
    await recordAudit({
      action: "LOGOUT",
      actorId: claims.uid,
      actorEmail: claims.email,
    });
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}

import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "ml_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionClaims = {
  uid: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
  iat: number;
  exp: number;
};

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

function secret(): string {
  return process.env.AUTH_SECRET || "";
}

export function authConfigured(): boolean {
  return secret().length > 0;
}

function sign(payloadB64: string): string {
  return crypto.createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

/** Build a signed session token for a user (null if AUTH_SECRET is missing). */
export function signSession(user: {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
}): string | null {
  if (!authConfigured()) return null;
  const now = Math.floor(Date.now() / 1000);
  const claims: SessionClaims = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + MAX_AGE_SECONDS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

function verifySession(token: string | undefined): SessionClaims | null {
  if (!token || !authConfigured()) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const claims = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    ) as SessionClaims;
    if (!claims.exp || claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

/** Read + verify the session cookie without a DB hit. */
export function readSessionClaims(): SessionClaims | null {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/**
 * Resolve the current admin from the session, confirming the account still
 * exists and is not disabled. One indexed lookup; returns null if not valid.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const claims = readSessionClaims();
  if (!claims) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: claims.uid } });
  if (!user || user.disabled) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "OWNER" | "STAFF",
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getCurrentAdmin()) !== null;
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

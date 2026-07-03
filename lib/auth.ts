import { cookies } from "next/headers";
import crypto from "node:crypto";

export const ADMIN_COOKIE = "ml_admin";

// The cookie never contains the password. It holds an HMAC of a fixed marker,
// keyed by ADMIN_PASSWORD. We can verify it without storing the secret, and it
// changes automatically if the password is rotated.
function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update("magaji-admin-v1").digest("hex");
}

export function issueToken(password: string): string | null {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return null;
  // Constant-time compare of the supplied password against the configured one.
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return expectedToken();
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = expectedToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Server-side check for use in server components and route handlers. */
export function isAdminAuthenticated(): boolean {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifyToken(token);
}

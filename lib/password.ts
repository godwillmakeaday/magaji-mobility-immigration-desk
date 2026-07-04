import crypto from "node:crypto";

// scrypt parameters (OWASP-reasonable defaults).
const N = 16384;
const r = 8;
const p = 1;
const KEYLEN = 64;

/** Produce a self-describing hash string: scrypt:N:r:p:saltB64:hashB64 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN, { N, r, p });
  return [
    "scrypt",
    N,
    r,
    p,
    salt.toString("base64"),
    hash.toString("base64"),
  ].join(":");
}

/** Constant-time verification against a stored scrypt hash string. */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(":");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const n = parseInt(parts[1], 10);
    const rr = parseInt(parts[2], 10);
    const pp = parseInt(parts[3], 10);
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: n,
      r: rr,
      p: pp,
    });
    return (
      actual.length === expected.length &&
      crypto.timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}

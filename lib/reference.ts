import crypto from "node:crypto";

// No 0/O/1/I to avoid confusion when read aloud or typed.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReference(): string {
  let s = "";
  for (let i = 0; i < 7; i++) {
    s += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return `ML-${s}`;
}

/** Normalise user-typed references: uppercase, strip spaces, ensure ML- prefix. */
export function normaliseReference(input: string): string {
  const raw = input.trim().toUpperCase().replace(/\s+/g, "");
  const body = raw.replace(/^ML-?/, "");
  return `ML-${body}`;
}

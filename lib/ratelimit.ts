// Best-effort, per-instance rate limiter. Good enough to blunt casual abuse of
// the public status lookup. NOTE: serverless runs multiple instances, so this is
// not a global limit — for hard guarantees use a shared store (e.g. Upstash /
// Vercel KV). The reference + phone requirement is the primary anti-enumeration
// control; this is defence in depth.

type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryMs: number } {
  const now = Date.now();
  const e = store.get(key);
  if (!e || now > e.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryMs: 0 };
  }
  if (e.count >= limit) {
    return { ok: false, retryMs: e.reset - now };
  }
  e.count += 1;
  return { ok: true, retryMs: 0 };
}

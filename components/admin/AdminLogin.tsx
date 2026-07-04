"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Seal } from "@/components/icons";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
      setLoading(false);
    }
  }

  const field =
    "mt-2 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6">
      <div className="w-full max-w-sm rounded-lg border border-hairline bg-white p-8 shadow-card">
        <Seal className="mx-auto h-11 w-11 text-brass-deep" />
        <h1 className="mt-5 text-center font-display text-xl text-ink">
          Magaji Law — Admin
        </h1>
        <p className="mt-2 text-center text-[13px] text-charcoal/60">
          Mobility &amp; Immigration Desk operations
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="text-[13px] font-semibold text-charcoal/80">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={field}
              placeholder="you@yourfirm.com"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-[13px] font-semibold text-charcoal/80">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={field}
              placeholder="Your password"
            />
          </div>
          {error && <p className="text-[13px] text-clay">{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={loading || !email || !password}
            className="w-full rounded-sm border border-ink bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-charcoal/45">
          Access is restricted to authorised Magaji Law staff.
        </p>
      </div>
    </main>
  );
}

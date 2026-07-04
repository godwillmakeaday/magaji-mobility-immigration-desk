"use client";

import { useState } from "react";
import { IconMagnifier, IconShield } from "@/components/icons";

type Result = {
  statusLabel: string;
  statusMeaning: string;
  destinationCountry: string;
  matterType: string;
  updatedAt: string;
};

export default function StatusLookup() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/status-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Lookup failed.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "mt-2 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <div className="rounded-lg border border-hairline bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ref" className="text-[13px] font-semibold text-charcoal/80">
            Reference code
          </label>
          <input
            id="ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            className={field}
            placeholder="e.g. ML-7Q4K2P"
          />
        </div>
        <div>
          <label htmlFor="ph" className="text-[13px] font-semibold text-charcoal/80">
            Phone number used
          </label>
          <input
            id="ph"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            className={field}
            placeholder="e.g. 0803 000 0000"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={lookup}
        disabled={loading || !reference || !phone}
        className="mt-6 inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
      >
        <IconMagnifier className="h-4 w-4" />
        {loading ? "Checking…" : "Check status"}
      </button>

      {error && <p className="mt-5 text-[14px] text-clay">{error}</p>}

      {result && (
        <div className="mt-6 rounded-md border border-forest/30 bg-forest/[0.05] p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
              Current status
            </span>
            <span className="text-[12px] text-charcoal/50">
              Updated{" "}
              {new Date(result.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="mt-2 font-display text-2xl text-ink">
            {result.statusLabel}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-charcoal/80">
            {result.statusMeaning}
          </p>
          <p className="mt-3 text-[13px] text-charcoal/60">
            {result.matterType} · {result.destinationCountry}
          </p>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 border-t border-hairline pt-4 text-[12px] leading-relaxed text-charcoal/55">
        <IconShield className="mt-0.5 h-4 w-4 flex-none text-forest" />
        For your protection we only show the current status here. For anything
        specific to your matter, contact Magaji Law directly.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REVIEW_STATUS_OPTIONS, REVIEW_STATUS_LABEL } from "@/lib/enums";

export default function ReviewEditor({
  id,
  initialStatus,
  initialNote,
}: {
  id: string;
  initialStatus: string;
  initialNote: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function save() {
    setState("saving");
    setError("");
    try {
      const res = await fetch(`/api/admin/mobility-reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNote: note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Update failed.");
      }
      setState("saved");
      router.refresh();
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }

  return (
    <div className="rounded-lg border border-hairline bg-white p-6 shadow-card">
      <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
        Manage matter
      </h3>

      <label className="mt-5 block text-[13px] font-semibold text-charcoal/80">
        Status
      </label>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setState("idle");
        }}
        className="mt-2 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
      >
        {REVIEW_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {REVIEW_STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      <label className="mt-5 block text-[13px] font-semibold text-charcoal/80">
        Internal note
      </label>
      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setState("idle");
        }}
        rows={5}
        placeholder="Internal working notes (not shown to the client)…"
        className="mt-2 w-full resize-y rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
      />

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={state === "saving"}
          className="rounded-sm border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          {state === "saving" ? "Saving…" : "Save changes"}
        </button>
        {state === "saved" && (
          <span className="text-[13px] font-medium text-forest">Saved</span>
        )}
        {state === "error" && (
          <span className="text-[13px] text-clay">{error}</span>
        )}
      </div>
    </div>
  );
}

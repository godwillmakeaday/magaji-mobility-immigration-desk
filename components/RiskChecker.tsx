"use client";

import { useMemo, useState } from "react";
import FormField from "./FormField";
import ComplianceNotice from "./ComplianceNotice";
import WhatsAppButton from "./WhatsAppButton";
import RiskResultCard from "./RiskResultCard";
import { buildWhatsAppLink, line } from "@/lib/whatsapp";
import { RED_FLAGS, riskFromCount } from "@/lib/risk";
import { IconCheck } from "./icons";

export default function RiskChecker() {
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(RED_FLAGS.length).fill(false)
  );
  const [destination, setDestination] = useState("");
  const [concern, setConcern] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const count = checked.filter(Boolean).length;
  const { label: level } = riskFromCount(count);
  const selected = useMemo(
    () => RED_FLAGS.filter((_, i) => checked[i]),
    [checked]
  );

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  const reset = () => setChecked(new Array(RED_FLAGS.length).fill(false));

  const ready = destination.trim() && concern.trim();

  const waLink = useMemo(() => {
    const selectedText =
      selected.length > 0 ? "\n" + selected.map((f) => `• ${f}`).join("\n") : "—";
    const body = [
      "Magaji Law Agent / Offer Risk Check",
      "",
      line("Risk Level", level),
      line("Number of Red Flags", String(count)),
      `Selected Red Flags: ${selectedText}`,
      line("Destination Country", destination),
      line("Main Concern", concern),
    ].join("\n");
    return buildWhatsAppLink(body);
  }, [selected, level, count, destination, concern]);

  async function handleSubmit() {
    if (!ready) {
      setTouched(true);
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/risk-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationCountry: destination,
          mainConcern: concern,
          selectedFlags: selected,
          redFlagCount: count,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save the risk check.");
      }
      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <section id="risk-checker" className="scroll-mt-20 bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Self-check</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            Check the Risk Before You Pay
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            Use this simple checker to identify warning signs in a visa promise,
            foreign job offer, travel arrangement, or study-abroad process.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          {/* Checklist */}
          <div className="rounded-lg border border-hairline bg-white p-6 shadow-card sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Destination country"
                name="risk-destination"
                value={destination}
                onChange={setDestination}
                required
                placeholder="e.g. Qatar, UK, Canada"
              />
              <FormField
                label="Main concern"
                name="risk-concern"
                value={concern}
                onChange={setConcern}
                required
                placeholder="What worries you most?"
              />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
              Tick everything that is true
            </p>
            <ul className="mt-4 space-y-px overflow-hidden rounded-md border border-hairline">
              {RED_FLAGS.map((flag, i) => {
                const on = checked[i];
                return (
                  <li key={flag}>
                    <label
                      className={[
                        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors",
                        on ? "bg-clay/[0.05]" : "bg-white hover:bg-mist/60",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-sm border transition-colors",
                          on
                            ? "border-clay bg-clay text-white"
                            : "border-hairline bg-paper text-transparent",
                        ].join(" ")}
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => toggle(i)}
                      />
                      <span className="text-[14px] leading-relaxed text-charcoal/85">
                        {flag}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            {count > 0 && (
              <button
                type="button"
                onClick={reset}
                className="mt-5 text-[13px] font-medium text-charcoal/55 underline-offset-4 hover:text-ink hover:underline"
              >
                Clear selections
              </button>
            )}
          </div>

          {/* Result rail */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <RiskResultCard level={level} count={count} />

            {status === "saved" ? (
              <div className="rounded-md border border-forest/30 bg-forest/[0.06] px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-forest">
                  <IconCheck className="h-4 w-4" /> Risk check saved
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-charcoal/75">
                  Magaji Law has a record of this assessment. You can still send
                  it directly on WhatsApp below.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "saving"}
                className="w-full rounded-sm border border-ink bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
              >
                {status === "saving" ? "Saving…" : "Submit Risk Check"}
              </button>
            )}

            {touched && !ready && (
              <p className="text-[13px] text-clay">
                Please add a destination country and your main concern before
                submitting.
              </p>
            )}
            {status === "error" && (
              <p className="text-[13px] text-clay">{error}</p>
            )}

            <WhatsAppButton
              href={waLink}
              variant="green"
              withArrow
              className="w-full"
            >
              Send This Risk Review to Magaji Law
            </WhatsAppButton>

            <ComplianceNotice tone="notice" title="Important notice:">
              This checker highlights visible warning signs only. It is not a
              legal opinion. A full document and verification review is
              recommended before you pay or submit anything.
            </ComplianceNotice>
          </aside>
        </div>
      </div>
    </section>
  );
}

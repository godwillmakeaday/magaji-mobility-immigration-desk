import Button from "./Button";
import { IconCheck, Seal } from "./icons";

const ledger = [
  { label: "Visa route", state: "Confirmed lawful" },
  { label: "Employer claim", state: "Verification pending" },
  { label: "Refund terms", state: "Under review" },
  { label: "Document file", state: "Readiness check" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* faint institutional grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,33,61,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 75%)",
        }}
      />
      <div className="shell relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        {/* Left: message */}
        <div>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-brass" />
            Mobility &amp; Immigration Desk
          </p>
          <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Move Abroad With Legal Clarity,
            <span className="text-brass-deep"> Not Blind Trust</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-charcoal/80">
            Magaji Law Mobility &amp; Immigration Desk helps Nigerians review visa
            promises, foreign job offers, travel documents, study-abroad files,
            and diaspora legal needs &mdash; before money, movement, or commitment.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#contact" variant="primary" withArrow>
              Request a Mobility Review
            </Button>
            <Button href="#contact" variant="secondary">
              Check an Agent or Offer
            </Button>
          </div>

          <p className="mt-7 max-w-lg border-l-2 border-forest/40 pl-4 text-sm leading-relaxed text-charcoal/70">
            We do not guarantee visa approval. We focus on lawful documentation,
            risk review, verification, and client protection.
          </p>
        </div>

        {/* Right: verification ledger signature */}
        <div className="relative">
          <div className="relative rounded-md border border-hairline bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
                Mobility Review Ledger
              </span>
              <Seal className="h-7 w-7 text-brass-deep" />
            </div>
            <ul className="divide-y divide-hairline">
              {ledger.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="font-medium text-ink">{row.label}</span>
                  <span className="flex items-center gap-2 text-sm text-forest">
                    <IconCheck className="h-4 w-4 text-forest" />
                    {row.state}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between bg-mist px-6 py-4">
              <span className="text-sm text-charcoal/70">
                Reviewed before any payment is advised.
              </span>
              <span className="font-display text-sm font-semibold tracking-wide text-brass-deep">
                M&middot;L
              </span>
            </div>
          </div>
          <p
            aria-hidden
            className="mt-4 text-center font-display text-xs uppercase tracking-eyebrow text-charcoal/40"
          >
            Verify &middot; Document &middot; Protect
          </p>
        </div>
      </div>
    </section>
  );
}

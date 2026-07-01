import Button from "./Button";
import { IconCross, IconAlert } from "./icons";

const redFlags = [
  "No written agreement",
  "No official receipt",
  "No clear refund terms",
  "Guaranteed visa promises",
  "Fake job offer",
  "Pressure to pay quickly",
  "No employer details",
  "No contract",
  "Request for false bank statements",
  "Refusal to disclose visa route",
  "WhatsApp-only arrangement",
  "No office, registration, or traceable identity",
];

export default function RedFlagsSection() {
  return (
    <section className="bg-charcoal py-20 text-paper lg:py-28">
      <div className="shell">
        <div className="flex max-w-2xl items-start gap-4">
          <span className="mt-1 inline-flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-clay/50 bg-clay/10 text-clay">
            <IconAlert className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
              Caution
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-paper sm:text-4xl">
              Before You Pay an Agent,
              <br />
              Check These Red Flags
            </h2>
          </div>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {redFlags.map((flag) => (
            <li
              key={flag}
              className="flex items-center gap-3 bg-white/[0.03] px-5 py-4"
            >
              <IconCross className="h-4 w-4 flex-none text-clay" />
              <span className="text-[15px] text-paper/85">{flag}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-5 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl text-paper sm:text-2xl">
            Let Magaji Law review the promise before you pay.
          </p>
          <Button href="#contact" variant="ghost" withArrow>
            Request a Mobility Review
          </Button>
        </div>
      </div>
    </section>
  );
}

import { IconShield, IconCheck } from "./icons";

const positions = [
  "Magaji Law does not guarantee visa approval. Visa decisions are made by the relevant government authorities.",
  "We do not support fake documents, forged bank records, false employment, or misleading applications.",
  "Where destination-country immigration advice is regulated, we work through or refer clients to appropriately licensed professionals.",
  "Where foreign job placement or recruitment is involved, the matter is handled under the appropriate recruitment, labour, or partner-compliance structure.",
];

export default function ComplianceSection() {
  return (
    <section id="compliance" className="bg-ink py-20 text-paper lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
            Where we stand
          </p>
          <h2 className="mt-5 font-display text-3xl leading-tight text-paper sm:text-4xl">
            Our Compliance Position
          </h2>
          <p className="mt-7 text-[15px] leading-relaxed text-paper/70">
            This is a legal desk, not a visa shop. The line we hold protects the
            client as much as the firm &mdash; lawful documentation, honest
            verification, and the right adviser for the right jurisdiction.
          </p>
          <span className="mt-9 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-brass/40 text-brass">
            <IconShield className="h-7 w-7" />
          </span>
        </div>

        <ul className="space-y-px overflow-hidden rounded-md border border-white/10">
          {positions.map((text) => (
            <li
              key={text}
              className="flex items-start gap-4 bg-white/[0.03] px-6 py-5"
            >
              <IconCheck className="mt-0.5 h-5 w-5 flex-none text-brass" />
              <p className="text-[15px] leading-relaxed text-paper/85">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { IconFlag } from "./icons";

const desks = [
  "Qatar & Gulf Desk",
  "UK Desk",
  "Canada Desk",
  "US Desk",
  "Australia Desk",
  "Côte d’Ivoire & Francophone Desk",
  "Schengen / Europe Desk",
  "Diaspora Nigeria Desk",
];

const SUBLINE =
  "Documentation, risk review, partner referral, and compliance support.";

export default function DestinationDesks() {
  return (
    <section id="desks" className="bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Coverage</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            Destination &amp; Diaspora Desks
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            Each desk provides documentation, risk review, partner referral, and
            compliance support &mdash; never a guaranteed visa service.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {desks.map((desk) => (
            <div
              key={desk}
              className="group bg-paper p-6 transition-colors duration-200 hover:bg-mist"
            >
              <IconFlag className="h-5 w-5 text-brass-deep" />
              <h3 className="mt-4 text-base font-semibold text-ink">{desk}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-charcoal/65">
                {SUBLINE}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

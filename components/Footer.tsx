import { Seal } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline bg-mist">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Seal className="h-9 w-9 text-brass-deep" />
              <span className="font-display text-lg font-bold tracking-wide text-ink">
                Magaji Law Mobility &amp; Immigration Desk
              </span>
            </div>
            <p className="mt-4 text-sm font-medium tracking-wide text-charcoal/70">
              Legal Documentation &nbsp;|&nbsp; Mobility Risk Review &nbsp;|&nbsp;
              Diaspora Support &nbsp;|&nbsp; Licensed Partner Referral
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
              Navigate
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-charcoal/75">
              <li><a className="hover:text-ink" href="#services">What We Do</a></li>
              <li><a className="hover:text-ink" href="#compliance">Compliance</a></li>
              <li><a className="hover:text-ink" href="#packages">Packages</a></li>
              <li><a className="hover:text-ink" href="#process">Process</a></li>
              <li><a className="hover:text-ink" href="#desks">Desks</a></li>
              <li><a className="hover:text-ink" href="#risk-checker">Check Risk</a></li>
              <li><a className="hover:text-ink" href="#contact">Request a Review</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-md border border-hairline bg-paper px-6 py-5">
          <p className="text-[13px] leading-relaxed text-charcoal/65">
            <span className="font-semibold text-charcoal/80">Disclaimer.</span>{" "}
            This page provides general service information and does not constitute
            a visa guarantee. Immigration outcomes are determined by the relevant
            government authorities. Magaji Law does not support fake documents,
            forged records, or misleading applications, and refers regulated
            immigration advice to appropriately licensed professionals.
          </p>
        </div>

        <p className="mt-8 text-xs text-charcoal/50">
          &copy; {year} Magaji Law. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

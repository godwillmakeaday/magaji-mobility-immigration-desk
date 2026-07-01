import Button from "./Button";

const packages = [
  {
    name: "Readiness Review",
    desc: "For clients who want to know whether their documents, route, or agent promise makes sense before paying further money.",
    tag: "Start here",
  },
  {
    name: "Application Support File",
    desc: "For clients who need their supporting documents arranged, checked, and prepared for submission.",
    tag: null,
  },
  {
    name: "Foreign Job Offer Review",
    desc: "For clients who have received an overseas job offer and want the employer, agent, contract, salary, and visa route reviewed.",
    tag: null,
  },
  {
    name: "Agent Dispute & Refund Support",
    desc: "For clients who have paid an agent and need legal review, a demand letter, refund negotiation, or further action.",
    tag: null,
  },
  {
    name: "Diaspora Legal Desk",
    desc: "For Nigerians abroad who need legal support in Nigeria without being physically present.",
    tag: null,
  },
];

export default function PackagesSection() {
  return (
    <section id="packages" className="bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Engagements</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            Start With the Right Review
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            Every matter begins with a review. Choose the entry point that fits
            where you are right now.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.name}
              className="flex h-full flex-col rounded-md border border-hairline bg-white p-7 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl leading-snug text-ink">{p.name}</h3>
                {p.tag && (
                  <span className="flex-none rounded-full border border-brass/40 bg-brass/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brass-deep">
                    {p.tag}
                  </span>
                )}
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-charcoal/75">
                {p.desc}
              </p>
              <div className="mt-7">
                <Button href="#contact" variant="secondary" withArrow>
                  Start Review
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

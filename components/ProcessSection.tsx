const steps = [
  {
    n: "1",
    title: "Submit Your Brief",
    body: "Tell us the country, route, agent, offer, payment demand, or document issue.",
  },
  {
    n: "2",
    title: "Upload or Share Documents",
    body: "We review relevant documents, letters, receipts, contracts, invitations, screenshots, or correspondence.",
  },
  {
    n: "3",
    title: "Risk & Readiness Review",
    body: "We identify missing documents, red flags, unclear promises, and legal or compliance concerns.",
  },
  {
    n: "4",
    title: "Written Guidance or Action Plan",
    body: "You receive a structured review, checklist, legal note, or recommended next step.",
  },
  {
    n: "5",
    title: "Partner or Legal Action Where Needed",
    body: "Where regulated foreign advice, recruitment compliance, or dispute recovery is needed, we guide the next step.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="bg-mist py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">The method</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            How It Works
          </h2>
        </div>

        <ol className="mt-14 space-y-px overflow-hidden rounded-md border border-hairline bg-hairline">
          {steps.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[auto_1fr] items-start gap-6 bg-paper px-6 py-7 sm:px-8"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-ink/15 bg-white font-display text-lg font-semibold text-ink">
                {s.n}
              </span>
              <div className="pt-1">
                <h3 className="text-lg text-ink">{s.title}</h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-charcoal/75">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

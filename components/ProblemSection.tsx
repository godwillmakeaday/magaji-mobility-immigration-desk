const problems = [
  {
    n: "01",
    title: "Is the route real?",
    body: "Many pay before confirming whether the visa pathway they were sold actually exists or applies to them.",
  },
  {
    n: "02",
    title: "Is the job genuine?",
    body: "Foreign job offers are accepted on faith — without verifying the employer, the contract, or the sponsorship.",
  },
  {
    n: "03",
    title: "Does the employer exist?",
    body: "Company names are taken at face value. A traceable, registered employer is rarely confirmed first.",
  },
  {
    n: "04",
    title: "Are the documents sufficient?",
    body: "Files are submitted incomplete or unsupported, then refused — after the money is already gone.",
  },
  {
    n: "05",
    title: "Are the refund terms clear?",
    body: "Money changes hands with no written agreement, no receipt, and no path to recovery when things fail.",
  },
  {
    n: "06",
    title: "Is a licensed adviser required?",
    body: "Some destinations regulate immigration advice. Using the wrong adviser can quietly weaken the whole application.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">The real risk</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            The Problem Is Not Travel.
            <br />
            The Problem Is Trust.
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            People rarely lose money on the journey itself. They lose it earlier
            &mdash; by paying an agent before any of these questions has an honest
            answer.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.n}
              className="group bg-paper p-7 transition-colors duration-200 hover:bg-mist"
            >
              <span className="font-display text-sm font-semibold tracking-wide text-brass/70">
                {p.n}
              </span>
              <h3 className="mt-4 text-xl text-ink">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/75">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

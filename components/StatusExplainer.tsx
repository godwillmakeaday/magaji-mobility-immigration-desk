import { REVIEW_STATUS_OPTIONS, REVIEW_STATUS_LABEL, REVIEW_STATUS_MEANING } from "@/lib/enums";

export default function StatusExplainer() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Transparency</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            How We Classify Review Requests
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            Every request moves through a clear set of stages. This is how we
            describe where a matter stands.
          </p>
        </div>

        <dl className="mt-14 grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-2">
          {REVIEW_STATUS_OPTIONS.map((key) => (
            <div key={key} className="bg-paper p-6">
              <dt className="flex items-center gap-3">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                <span className="font-display text-lg text-ink">
                  {REVIEW_STATUS_LABEL[key]}
                </span>
              </dt>
              <dd className="mt-2 pl-[18px] text-[15px] leading-relaxed text-charcoal/75">
                {REVIEW_STATUS_MEANING[key]}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-[15px] text-charcoal/75">
          Already submitted a request?{" "}
          <a
            href="/status"
            className="font-semibold text-brass-deep underline underline-offset-2 hover:text-ink"
          >
            Check your status
          </a>{" "}
          with your reference code and phone number.
        </p>
      </div>
    </section>
  );
}

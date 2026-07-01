import Button from "./Button";
import { Seal } from "./icons";

export default function CTASection() {
  return (
    <section id="contact" className="bg-paper py-20 lg:py-28">
      <div className="shell">
        <div className="relative overflow-hidden rounded-lg border border-hairline bg-ink px-8 py-16 text-center text-paper sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, #B08D57 0%, transparent 55%)",
            }}
          />
          <Seal className="relative mx-auto h-12 w-12 text-brass" />
          <h2 className="relative mx-auto mt-7 max-w-2xl font-display text-3xl leading-tight text-paper sm:text-4xl">
            Before You Pay. Before You Travel. Before You Submit.
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            Let us review the documents, the promise, the payment terms, and the
            risk &mdash; while it can still change the outcome.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <Button
              href="https://wa.me/"
              variant="ghost"
              withArrow
              className="!text-ink"
            >
              Request Mobility Review
            </Button>
            <a
              href="https://wa.me/"
              className="inline-flex items-center justify-center rounded-sm border border-paper/30 px-6 py-3 text-sm font-semibold tracking-wide text-paper transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              Report an Agent Issue
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

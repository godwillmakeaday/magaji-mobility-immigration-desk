import {
  IconDocCheck,
  IconBriefcase,
  IconCap,
  IconMagnifier,
  IconGavel,
  IconGlobe,
} from "./icons";

const services = [
  {
    Icon: IconDocCheck,
    title: "Visa & Travel Documentation Support",
    body: "Document review, invitation letters, affidavits, consent letters, application-readiness checks, and supporting file organisation.",
  },
  {
    Icon: IconBriefcase,
    title: "Work Abroad & Employment Verification",
    body: "Review of foreign job offers, employer claims, contracts, salaries, sponsorship terms, agent promises, and travel conditions.",
  },
  {
    Icon: IconCap,
    title: "Student & Study Abroad Support",
    body: "Admission documentation, sponsor letters, guardian consent, school verification, statement review, and legal documents for study-related travel.",
  },
  {
    Icon: IconMagnifier,
    title: "Immigration Risk Review",
    body: "Review of the promise, process, payment demand, documents, agent profile, and likely red flags before the client commits.",
  },
  {
    Icon: IconGavel,
    title: "Agent Dispute & Refund Support",
    body: "Demand letters, refund negotiation, breach review, legal documentation, and escalation support where a service has failed.",
  },
  {
    Icon: IconGlobe,
    title: "Diaspora Legal Support",
    body: "Nigerian property, land verification, powers of attorney, family documentation, company registration, contract review, and local representation.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-mist py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Our work</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            What the Mobility Desk Does
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="flex h-full flex-col rounded-md border border-hairline bg-white p-7 shadow-card transition-shadow duration-200 hover:shadow-card-lift"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-brass/30 bg-brass/5 text-brass-deep">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg leading-snug text-ink">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/75">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import FormField from "./FormField";
import ComplianceNotice from "./ComplianceNotice";
import WhatsAppButton from "./WhatsAppButton";
import { buildWhatsAppLink, line } from "@/lib/whatsapp";
import {
  MATTER_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  CONTACT_METHOD_OPTIONS,
} from "@/lib/enums";
import { IconUpload, IconCheck, Seal } from "./icons";

type Form = {
  fullName: string;
  phone: string;
  email: string;
  currentLocation: string;
  destination: string;
  matterType: string;
  paymentStatus: string;
  amount: string;
  agent: string;
  promise: string;
  documents: string;
  concern: string;
  contactMethod: string;
};

const EMPTY: Form = {
  fullName: "",
  phone: "",
  email: "",
  currentLocation: "",
  destination: "",
  matterType: "",
  paymentStatus: "",
  amount: "",
  agent: "",
  promise: "",
  documents: "",
  concern: "",
  contactMethod: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Group({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-hairline pt-7">
      <legend className="flex items-center gap-3 pb-5">
        <span className="font-display text-sm font-semibold text-brass/70">
          {step}
        </span>
        <span className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/60">
          {title}
        </span>
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function MobilityIntakeForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");

  const set = (key: keyof Form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.phone.trim()) e.phone = "Phone / WhatsApp number is required.";
    if (!form.destination.trim())
      e.destination = "Destination country is required.";
    if (!form.matterType) e.matterType = "Please choose a matter type.";
    if (!form.concern.trim()) e.concern = "Main concern is required.";
    if (!acknowledged) e.acknowledged = "Please acknowledge the notice.";
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim()))
      e.email = "Please enter a valid email address.";
    return e;
  }

  const waLink = useMemo(() => {
    const body = [
      "Magaji Law Mobility Review Request",
      "",
      line("Name", form.fullName),
      line("Phone", form.phone),
      line("Email", form.email),
      line("Current Location", form.currentLocation),
      line("Destination Country", form.destination),
      line("Matter Type", form.matterType),
      line("Payment Status", form.paymentStatus),
      line("Amount Paid/Requested", form.amount),
      line("Agent/Company/Employer", form.agent),
      line("Promise Made", form.promise),
      line("Documents Available", form.documents),
      line("Main Concern", form.concern),
      line("Preferred Contact Method", form.contactMethod),
    ].join("\n");
    return buildWhatsAppLink(body);
  }, [form]);

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("saving");
    setServerError("");
    try {
      const res = await fetch("/api/mobility-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          currentLocation: form.currentLocation,
          destinationCountry: form.destination,
          matterType: form.matterType,
          paymentStatus: form.paymentStatus,
          amountPaidOrRequested: form.amount,
          agentCompanyEmployer: form.agent,
          promiseMade: form.promise,
          documentsAvailable: form.documents,
          mainConcern: form.concern,
          preferredContactMethod: form.contactMethod,
          complianceAcknowledged: acknowledged,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Could not save your request.");
      }
      const data = await res.json().catch(() => ({}));
      setReference(data.reference ?? null);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  const err = (k: string) =>
    errors[k] ? (
      <p className="mt-1.5 text-[12px] text-clay">{errors[k]}</p>
    ) : null;

  return (
    <section id="contact" className="scroll-mt-20 bg-mist py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Start here</p>
          <h2 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
            Request a Mobility Review
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
            Tell us the country, route, promise, agent, offer, or document issue.
            We will review the risk, documentation, and next best step.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <div className="rounded-lg border border-hairline bg-white p-6 shadow-card sm:p-9">
            {status === "saved" ? (
              <div className="py-8 text-center">
                <Seal className="mx-auto h-12 w-12 text-brass-deep" />
                <h3 className="mt-6 font-display text-2xl text-ink">
                  Review request received
                </h3>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                  Thank you, {form.fullName.split(" ")[0] || "there"}. Your
                  request has been logged with Magaji Law. For the fastest
                  response, send the same details on WhatsApp below &mdash; we
                  will confirm the proper document-sharing channel before any
                  sensitive documents are shared.
                </p>

                {reference && (
                  <div className="mx-auto mt-6 max-w-sm rounded-md border border-brass/30 bg-brass/[0.06] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-brass-deep">
                      Your reference code
                    </p>
                    <p className="mt-1 font-display text-2xl tracking-wide text-ink">
                      {reference}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-charcoal/70">
                      Keep this code. You can check your status any time at{" "}
                      <a
                        href="/status"
                        className="font-semibold text-brass-deep underline underline-offset-2"
                      >
                        /status
                      </a>{" "}
                      using this code and your phone number.
                    </p>
                  </div>
                )}
                <div className="mt-7 flex justify-center">
                  <WhatsAppButton href={waLink} variant="green" withArrow>
                    Send Details on WhatsApp
                  </WhatsAppButton>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <Group step="01" title="Personal details">
                  <div>
                    <FormField
                      label="Full name"
                      name="fullName"
                      value={form.fullName}
                      onChange={set("fullName")}
                      required
                      placeholder="Your full name"
                    />
                    {err("fullName")}
                  </div>
                  <div>
                    <FormField
                      label="Phone / WhatsApp number"
                      name="phone"
                      as="input"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      required
                      placeholder="e.g. 0803 000 0000"
                    />
                    {err("phone")}
                  </div>
                  <div>
                    <FormField
                      label="Email address"
                      name="email"
                      as="input"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                    />
                    {err("email")}
                  </div>
                  <FormField
                    label="Current location"
                    name="currentLocation"
                    value={form.currentLocation}
                    onChange={set("currentLocation")}
                    placeholder="City, country"
                  />
                </Group>

                <Group step="02" title="Destination & matter type">
                  <div>
                    <FormField
                      label="Destination country"
                      name="destination"
                      value={form.destination}
                      onChange={set("destination")}
                      required
                      placeholder="e.g. Qatar, UK, Canada"
                    />
                    {err("destination")}
                  </div>
                  <div>
                    <FormField
                      label="Type of matter"
                      name="matterType"
                      as="select"
                      options={[...MATTER_TYPE_OPTIONS]}
                      value={form.matterType}
                      onChange={set("matterType")}
                      required
                    />
                    {err("matterType")}
                  </div>
                </Group>

                <Group step="03" title="Payment & agent details">
                  <FormField
                    label="Have you already paid any money?"
                    name="paymentStatus"
                    as="select"
                    options={[...PAYMENT_STATUS_OPTIONS]}
                    value={form.paymentStatus}
                    onChange={set("paymentStatus")}
                  />
                  <FormField
                    label="Amount paid or requested"
                    name="amount"
                    value={form.amount}
                    onChange={set("amount")}
                    placeholder="e.g. ₦850,000"
                  />
                  <FormField
                    label="Name of agent / company / employer"
                    name="agent"
                    value={form.agent}
                    onChange={set("agent")}
                    placeholder="Who are you dealing with?"
                    className="sm:col-span-2"
                  />
                </Group>

                <Group step="04" title="Promise & documents">
                  <FormField
                    label="What were you promised?"
                    name="promise"
                    as="textarea"
                    value={form.promise}
                    onChange={set("promise")}
                    placeholder="The offer, guarantee, or arrangement as it was described to you."
                    className="sm:col-span-2"
                  />
                  <FormField
                    label="What documents do you currently have?"
                    name="documents"
                    as="textarea"
                    value={form.documents}
                    onChange={set("documents")}
                    placeholder="e.g. offer letter, receipt, passport, admission letter, contract."
                    className="sm:col-span-2"
                  />
                </Group>

                <Group step="05" title="Concern & contact method">
                  <div className="sm:col-span-2">
                    <FormField
                      label="What is your main concern?"
                      name="concern"
                      as="textarea"
                      value={form.concern}
                      onChange={set("concern")}
                      required
                      placeholder="What worries you most about this arrangement?"
                    />
                    {err("concern")}
                  </div>
                  <FormField
                    label="Preferred contact method"
                    name="contactMethod"
                    as="select"
                    options={[...CONTACT_METHOD_OPTIONS]}
                    value={form.contactMethod}
                    onChange={set("contactMethod")}
                  />
                </Group>

                {/* Upload placeholder (non-functional by design) */}
                <div className="flex items-start gap-3 rounded-md border border-dashed border-hairline bg-mist/60 px-5 py-4">
                  <IconUpload className="mt-0.5 h-5 w-5 flex-none text-charcoal/40" />
                  <div>
                    <p className="text-[13px] font-semibold text-charcoal/80">
                      Document Upload Coming Soon
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-charcoal/65">
                      For now, please submit your review request first. Magaji Law
                      will confirm the proper document-sharing channel before any
                      sensitive documents are sent.
                    </p>
                  </div>
                </div>

                {/* Compliance acknowledgment */}
                <fieldset className="border-t border-hairline pt-7">
                  <legend className="flex items-center gap-3 pb-5">
                    <span className="font-display text-sm font-semibold text-brass/70">
                      06
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/60">
                      Compliance acknowledgment
                    </span>
                  </legend>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="mt-1 h-4 w-4 flex-none accent-forest"
                    />
                    <span className="text-[14px] leading-relaxed text-charcoal/80">
                      I understand that Magaji Law does not guarantee visa
                      approval and that immigration decisions are made by the
                      relevant government authorities.
                    </span>
                  </label>
                  {err("acknowledged")}
                </fieldset>

                {/* Submit */}
                <div className="border-t border-hairline pt-7">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "saving"}
                    className="w-full rounded-sm border border-ink bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-charcoal disabled:opacity-50 sm:w-auto"
                  >
                    {status === "saving"
                      ? "Submitting…"
                      : "Prepare My Review Request"}
                  </button>
                  {status === "error" && serverError && (
                    <p className="mt-3 text-[13px] text-clay">{serverError}</p>
                  )}
                  <p className="mt-3 text-[12px] leading-relaxed text-charcoal/55">
                    Your request is saved to Magaji Law and you will then be
                    offered a WhatsApp button with the same details.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side rail: compliance notices */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <ComplianceNotice tone="notice" title="Important Notice:">
              Magaji Law does not guarantee visa approval. Immigration outcomes
              are determined by the relevant government authorities. Our role is
              limited to lawful documentation support, legal review, risk
              assessment, client protection, and referral to licensed
              destination-country professionals where required.
            </ComplianceNotice>
            <ComplianceNotice tone="caution" title="Document Integrity Notice:">
              Magaji Law does not support forged bank records, fake employment
              letters, false identities, misleading applications, or any form of
              false documentation.
            </ComplianceNotice>
          </aside>
        </div>
      </div>
    </section>
  );
}

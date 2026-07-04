import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import StatusLookup from "@/components/StatusLookup";

export const metadata: Metadata = {
  title: "Check Your Review Status | Magaji Law Mobility & Immigration Desk",
  description:
    "Enter your reference code and phone number to see the current status of your mobility review request.",
};

export default function StatusPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-paper">
        <section className="shell py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">Client area</p>
            <h1 className="ledger-line mt-5 text-3xl leading-tight sm:text-4xl">
              Check Your Review Status
            </h1>
            <p className="mt-9 text-lg leading-relaxed text-charcoal/80">
              Enter the reference code from your submission and the phone number
              you used. We&rsquo;ll show you where your review currently stands.
            </p>
          </div>

          <div className="mt-12 max-w-3xl">
            <StatusLookup />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

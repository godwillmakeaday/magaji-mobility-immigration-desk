import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import ComplianceSection from "@/components/ComplianceSection";
import PackagesSection from "@/components/PackagesSection";
import ProcessSection from "@/components/ProcessSection";
import DestinationDesks from "@/components/DestinationDesks";
import RedFlagsSection from "@/components/RedFlagsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <ServicesSection />
        <ComplianceSection />
        <PackagesSection />
        <ProcessSection />
        <DestinationDesks />
        <RedFlagsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

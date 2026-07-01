import type { Metadata } from "next";
import "./globals.css";

// Self-hosted fonts (never next/font/google) — @fontsource, per project standard
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/libre-franklin/300.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/500.css";
import "@fontsource/libre-franklin/600.css";
import "@fontsource/libre-franklin/700.css";

export const metadata: Metadata = {
  title: "Magaji Law Mobility & Immigration Desk | Move Abroad With Legal Clarity",
  description:
    "A Nigerian legal, documentation, mobility-risk and compliance desk. We review visa promises, foreign job offers, travel documents and study-abroad files before money, movement, or commitment. We do not guarantee visa approval.",
  keywords: [
    "Magaji Law",
    "immigration legal review Nigeria",
    "visa document review",
    "foreign job offer review",
    "study abroad documentation",
    "agent dispute refund",
    "diaspora legal support Nigeria",
  ],
  openGraph: {
    title: "Magaji Law Mobility & Immigration Desk",
    description:
      "Move abroad with legal clarity, not blind trust. Lawful documentation, mobility-risk review, verification and client protection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

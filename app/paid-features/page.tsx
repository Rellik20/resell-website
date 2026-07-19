import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Paid Features Terms | ReSell Marketplace",
  description: "Terms for sponsored listings and other one-time paid features.",
};

export default function PaidFeaturesPage() {
  return (
    <LegalPage
      fileName="paid-features.md"
      eyebrow="Paid Features"
    />
  );
}

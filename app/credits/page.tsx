import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Credits | ReSell Marketplace",
  description: "Development credits for ReSell Marketplace.",
};

export default function CreditsPage() {
  return (
    <LegalPage
      fileName="credits.md"
      eyebrow="Credits"
      plain
    />
  );
}

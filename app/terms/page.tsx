import LegalPage from "../components/LegalPage";

export const metadata = {
  title: "Terms of Service | ReSell Marketplace",
  description: "Terms of Service for ReSell Marketplace.",
};

export default function TermsPage() {
  return <LegalPage fileName="terms-of-service.md" eyebrow="Terms of Service" />;
}

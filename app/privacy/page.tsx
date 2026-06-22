import LegalPage from "../components/LegalPage";

export const metadata = {
  title: "Privacy Policy | ReSell Marketplace",
  description: "Privacy Policy for ReSell Marketplace.",
};

export default function PrivacyPage() {
  return <LegalPage fileName="privacy-policy.md" eyebrow="Privacy Policy" />;
}

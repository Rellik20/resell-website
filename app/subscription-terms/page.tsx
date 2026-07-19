import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Subscription Terms | ReSell Marketplace",
  description: "Terms for ReSell Pro and profile badge subscriptions.",
};

export default function SubscriptionTermsPage() {
  return (
    <LegalPage
      fileName="subscription-terms.md"
      eyebrow="Subscription Terms"
    />
  );
}

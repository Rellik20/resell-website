import LegalPage from "../components/LegalPage";

export const metadata = {
  title: "Delete Account | ReSell Marketplace",
  description: "Account deletion instructions for ReSell Marketplace.",
};

export default function DeleteAccountPage() {
  return <LegalPage fileName="account-deletion.md" eyebrow="Account deletion" />;
}

import { MailIcon } from "../components/WebsiteIcons";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export const metadata = {
  title: "Support | ReSell Marketplace",
  description: "Contact support for ReSell Marketplace.",
};

export default function SupportPage() {
  return (
    <main className="site-shell resell-interior">
      <SiteHeader />
      <section className="rs-prose rs-rise">
        <p className="rs-eyebrow">Support</p>
        <h1>We're here to help.</h1>
        <p>
          Questions about your account, listings, messages,
          subscriptions, or safety tools? Contact ReSell support.
        </p>
        <div className="rs-support-contact">
          <span>SUPPORT EMAIL</span>
          <a href="mailto:resell21126@gmail.com">
            resell21126@gmail.com
          </a>
        </div>
        <h2>Account deletion and recovery</h2>
        <p>
          Find instructions for deleting your account and information
          about the 30-day recovery period.
        </p>
        <Link className="rs-text-link" href="/delete-account">
          View account deletion information
          <MailIcon />
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

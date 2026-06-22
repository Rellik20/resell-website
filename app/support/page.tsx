import Link from "next/link";
export const metadata = {
  title: "Support | ReSell Marketplace",
  description: "Contact support for ReSell Marketplace.",
};

export default function SupportPage() {
  return (
    <main className="site-shell">
      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>ReSell Marketplace</span>
        </Link>
        <div className="nav-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/support">Support</Link>
        </div>
      </nav>

      <section className="legal-card">
        <p className="eyebrow">Support</p>
        <h1>Contact ReSell Marketplace support</h1>
        <p>
          Need help with your account, listings, messages, safety tools, or app access?
          Contact ReSell Marketplace support using the email below.
        </p>

        <div className="support-box">
          <span>Support email</span>
          <a href="mailto:support@resellmarketplace.app">support@resellmarketplace.app</a>
        </div>

        <p>
          For account deletion instructions, visit{" "}
          <Link href="/delete-account">Delete Account</Link>.
        </p>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()} ReSell Marketplace</div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/delete-account">Delete Account</Link>
        </div>
      </footer>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";

export const STORE_LINKS = {
  ios: "https://apps.apple.com/us/app/resell-marketplace/id6759349548",
  android: "https://play.google.com/store/apps/details?id=com.rellik20.mobile",
} as const;

const policyLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/subscription-terms", label: "Subscription Terms" },
  { href: "/paid-features", label: "Paid Features" },
  { href: "/delete-account", label: "Account Deletion" },
];

const otherLinks = [
  { href: "/", label: "Home" },
  { href: "/support", label: "Support" },
  { href: "/credits", label: "Credits" },
];

export function SiteHeader() {
  return (
    <header className="rs-header">
      <nav className="rs-header-inner" aria-label="Main navigation">
        <Link className="rs-brand" href="/">
          <Image
            src="/resell-logo.png"
            width={43}
            height={43}
            alt=""
            className="rs-brand-logo"
          />
          <span>ReSell<span className="rs-brand-secondary"> Marketplace</span></span>
        </Link>

        <div className="rs-desktop-links">
          <Link href="/">Home</Link>
          <Link href="/#features">Features</Link>
          <Link href="/paid-features">ReSell Pro</Link>
          <Link href="/support">Support</Link>
          <details className="rs-nav-dropdown">
            <summary>Information <span className="rs-chevron" /></summary>
            <div className="rs-dropdown-panel">
              {policyLinks.map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/credits">Credits</Link>
            </div>
          </details>
        </div>

        <Link className="rs-header-cta" href="/#download">
          Get ReSell
        </Link>

        <details className="rs-mobile-nav">
          <summary aria-label="Open website menu">
            <span />
            <span />
            <span />
          </summary>
          <div className="rs-mobile-nav-panel">
            <Link href="/">Home</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#download">Download ReSell</Link>
            <Link href="/support">Support</Link>
            {policyLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/credits">Credits</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="rs-footer">
      <div className="rs-footer-intro">
        <Link href="/" className="rs-footer-brand">ReSell Marketplace</Link>
        <p>Discover nearby. List simply. Connect directly.</p>
      </div>
      <nav className="rs-footer-links" aria-label="Footer navigation">
        {[...otherLinks, ...policyLinks].map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="rs-footer-bottom">
        <span>© {new Date().getFullYear()} ReSell Marketplace</span>
        <span>Local connections, made simpler.</span>
      </div>
    </footer>
  );
}

import Link from "next/link";
const appStoreUrl = "https://apps.apple.com/us/app/resell-marketplace/id6759349548";
const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.rellik20.mobile";

const features = [
  "Create listings with photos, price, description, and approximate location",
  "Browse nearby marketplace items with a clean mobile-first experience",
  "Search marketplace listings and public user profiles",
  "Favorite listings you want to revisit",
  "Message buyers and sellers directly in the app",
  "Report unsafe listings and block users when needed",
];

export default function Home() {
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

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Local resale made simple</p>
          <h1>Buy and sell nearby items with a cleaner marketplace experience.</h1>
          <p className="hero-text">
            ReSell Marketplace helps users create listings, browse local items, search people
            and public profiles, favorite listings, and message safely inside the app.
          </p>

          <div className="cta-row">
            <a className="primary-btn" href={appStoreUrl} target="_blank" rel="noreferrer">
              Download on the App Store
            </a>
            <a className="secondary-btn" href={googlePlayUrl} target="_blank" rel="noreferrer">
              Get it on Google Play
            </a>
          </div>

          <p className="small-note">
            ReSell does not process payments, provide escrow, handle shipping, or guarantee
            transactions. Buyers and sellers arrange transactions directly.
          </p>
        </div>

        <div className="phone-card" aria-label="ReSell app preview">
          <div className="phone-top" />
          <div className="phone-screen">
            <div className="search-pill">Search marketplace</div>
            <div className="grid">
              <div className="listing-card blue" />
              <div className="listing-card dark" />
              <div className="listing-card dark" />
              <div className="listing-card blue" />
            </div>
            <div className="message-card">
              <strong>Message sellers</strong>
              <span>Connect directly about nearby listings.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div>
          <p className="eyebrow">Key features</p>
          <h2>Built for practical person-to-person resale.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature}>
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="safety-panel">
        <div>
          <p className="eyebrow">Safety and privacy</p>
          <h2>Approximate location, reporting, and blocking tools.</h2>
          <p>
            ReSell is designed for local marketplace activity while keeping exact coordinates
            private from public listings. Users should follow safe local marketplace practices
            when arranging transactions.
          </p>
        </div>
        <Link className="secondary-btn" href="/support">
          Get support
        </Link>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()} ReSell Marketplace</div>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/community-guidelines">Community Guidelines</Link>
          <Link href="/delete-account">Delete Account</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import { ExternalLinkIcon } from "./components/WebsiteIcons";
import {
  SiteHeader,
  SiteFooter,
  STORE_LINKS,
} from "./components/SiteChrome";

const features = [
  {
    number: "01",
    title: "Discover what is nearby.",
    description:
      "Browse local resale listings, explore public profiles, and save items to your favorites.",
  },
  {
    number: "02",
    title: "List with confidence.",
    description:
      "Add photos, a description, a price, and an approximate location to make your items easy to discover.",
  },
  {
    number: "03",
    title: "Make the connection.",
    description:
      "Message buyers or sellers directly, discuss the details, and arrange transactions independently.",
  },
];

export default function Home() {
  return (
    <main className="site-shell resell-landing">
      <SiteHeader />

      <section className="rs-hero">
        <div className="rs-hero-content">
          <h1>Buy and sell locally.</h1>

          <div className="rs-download-links" id="download">
            <a
              className="rs-store-link"
              href={STORE_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download ReSell on the Apple App Store"
            >
              <span className="rs-store-overline">Download on the</span>
              <strong>App Store</strong>
              <ExternalLinkIcon />
            </a>
            <a
              className="rs-store-link"
              href={STORE_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get ReSell on Google Play"
            >
              <span className="rs-store-overline">Get it on</span>
              <strong>Google Play</strong>
              <ExternalLinkIcon />
            </a>
          </div>
          <p className="rs-hero-description">
            Browse nearby listings, sell items you no longer need, and message
            buyers and sellers directly in the ReSell app.
          </p>




        </div>


      </section>

      <section className="rs-section rs-features" id="features">
        <div className="rs-section-heading">
                    <h2>How ReSell works</h2>
          <p>
            An easier way to discover, list, save, and connect
            with your local community.
          </p>
        </div>
        <div className="rs-feature-list">
          {features.map((feature) => (
            <div className="rs-feature" key={feature.number}>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rs-section rs-pro-section">
        <div>
                    <h2>Free listings and ReSell Pro</h2>
        </div>
        <div className="rs-pro-copy">
          <p>
            Publish up to three new listings each UTC calendar day
            with a free account. ReSell Pro subscribers can publish
            unlimited daily listings while their subscription is active.
          </p>
          <Link className="rs-text-link" href="/paid-features">
            Explore paid features
          </Link>
        </div>
      </section>

      <section className="rs-section rs-safety">
        <div className="rs-section-heading">
                    <h2>Marketplace safety</h2>
        </div>
        <div className="rs-safety-grid">
          <div>
                        <h3>Approximate location</h3>
            <p>
              Public listings use approximate location information
              rather than exposing exact coordinates.
            </p>
          </div>
          <div>
                        <h3>Reporting and blocking</h3>
            <p>
              Tools to report problematic content and block other
              users when needed.
            </p>
          </div>
          <div>
                        <h3>Direct arrangements</h3>
            <p>
              Buyers and sellers arrange payment, pickup, and
              other transaction details themselves.
            </p>
          </div>
        </div>
        <p className="rs-disclaimer">
          ReSell provides listing, discovery, and messaging tools.
          It does not process marketplace payments, provide escrow,
          handle shipping, or guarantee transactions.
        </p>
      </section>

      <section className="rs-last-cta">
                <h2>Ready to ReSell?</h2>
        <div className="rs-download-links">
          <a className="rs-button rs-button-primary"
             href={STORE_LINKS.ios}
             target="_blank"
             rel="noopener noreferrer">
            App Store <ExternalLinkIcon />
          </a>
          <a className="rs-button rs-button-outline"
             href={STORE_LINKS.android}
             target="_blank"
             rel="noopener noreferrer">
            Google Play <ExternalLinkIcon />
          </a>
        </div>
        <Link className="rs-small-link" href="/support">
          Need help? Visit Support
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}

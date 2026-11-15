import Link from "next/link";
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
        <div className="rs-hero-content rs-rise">
          <p className="rs-eyebrow">
            <span className="rs-eyebrow-mark" />
            A marketplace built around you
          </p>
          <h1>
            Great finds.
            <br />
            <span>Closer than you think.</span>
          </h1>
          <p className="rs-hero-description">
            Give your items a second life. Discover local listings,
            connect with people nearby, and make your next great find
            through ReSell Marketplace.
          </p>

          <div className="rs-download-links" id="download">
            <a
              className="rs-button rs-button-primary"
              href={STORE_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download for iPhone
              <span aria-hidden="true">↗</span>
            </a>
            <a
              className="rs-button rs-button-outline"
              href={STORE_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Android
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <p className="rs-hero-note">
            Available for iOS and Android.
          </p>
        </div>

        <div className="rs-visual-stage rs-rise rs-delay-1">
          <div className="rs-glow" aria-hidden="true" />
          <div className="rs-device" aria-label="Illustrative ReSell app preview">
            <div className="rs-device-island" />
            <div className="rs-device-content">
              <div className="rs-device-heading">
                <strong>ReSell</strong>
                <span>Discover</span>
              </div>
              <div className="rs-device-search">
                <span className="rs-search-circle" />
                Search the marketplace
              </div>
              <div className="rs-device-label">Explore nearby</div>
              <div className="rs-device-stories" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <div className="rs-device-listings">
                <div className="rs-mini-listing">
                  <div className="rs-mini-image rs-image-one" />
                  <strong>Home &amp; living</strong>
                  <span>Discover local finds</span>
                </div>
                <div className="rs-mini-listing">
                  <div className="rs-mini-image rs-image-two" />
                  <strong>Tech &amp; gear</strong>
                  <span>Explore what is nearby</span>
                </div>
                <div className="rs-mini-listing">
                  <div className="rs-mini-image rs-image-three" />
                  <strong>Everyday essentials</strong>
                  <span>Give items new life</span>
                </div>
                <div className="rs-mini-listing">
                  <div className="rs-mini-image rs-image-four" />
                  <strong>More to discover</strong>
                  <span>Keep looking around</span>
                </div>
              </div>
              <div className="rs-device-tabs">
                <span>Home</span><span>Search</span><span>Sell</span>
                <span>Messages</span>
              </div>
            </div>
          </div>
          <p className="rs-preview-caption">Illustrative interface preview</p>
        </div>
      </section>

      <section className="rs-section rs-features" id="features">
        <div className="rs-section-heading">
          <p className="rs-eyebrow">Everything in one place</p>
          <h2>Made for the way<br />people buy and sell.</h2>
          <p>
            An easier way to discover, list, save, and connect
            with your local community.
          </p>
        </div>
        <div className="rs-feature-list">
          {features.map((feature) => (
            <div className="rs-feature" key={feature.number}>
              <span className="rs-feature-index">{feature.number}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <span className="rs-feature-arrow" aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rs-section rs-pro-section">
        <div>
          <p className="rs-eyebrow">List on your terms</p>
          <h2>Start free.<br /><span>Go further with Pro.</span></h2>
        </div>
        <div className="rs-pro-copy">
          <p>
            Publish up to three new listings each UTC calendar day
            with a free account. ReSell Pro subscribers can publish
            unlimited daily listings while their subscription is active.
          </p>
          <Link className="rs-text-link" href="/paid-features">
            Explore paid features <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="rs-section rs-safety">
        <div className="rs-section-heading">
          <p className="rs-eyebrow">Designed for local connection</p>
          <h2>Explore with more control.</h2>
        </div>
        <div className="rs-safety-grid">
          <div>
            <span className="rs-safety-index">01 / PRIVACY</span>
            <h3>Approximate location</h3>
            <p>
              Public listings use approximate location information
              rather than exposing exact coordinates.
            </p>
          </div>
          <div>
            <span className="rs-safety-index">02 / SAFETY</span>
            <h3>Reporting and blocking</h3>
            <p>
              Tools to report problematic content and block other
              users when needed.
            </p>
          </div>
          <div>
            <span className="rs-safety-index">03 / INDEPENDENCE</span>
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
        <p className="rs-eyebrow">Your next find starts here</p>
        <h2>Ready to ReSell?</h2>
        <div className="rs-download-links">
          <a className="rs-button rs-button-primary"
             href={STORE_LINKS.ios}
             target="_blank"
             rel="noopener noreferrer">
            App Store <span aria-hidden="true">↗</span>
          </a>
          <a className="rs-button rs-button-outline"
             href={STORE_LINKS.android}
             target="_blank"
             rel="noopener noreferrer">
            Google Play <span aria-hidden="true">↗</span>
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

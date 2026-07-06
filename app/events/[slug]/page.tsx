import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://www.resellmarketplace.app";
const API_BASE_URL = process.env.RESELL_API_BASE_URL || "https://resell-v5y2.onrender.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type EventPreview = {
  title: string;
  description: string;
  coverImageUrl: string;
  startAt: string | null;
  endAt: string | null;
  eventType: string;
  venueName: string;
  locationLabel: string;
  priceText: string;
  shareSlug: string;
  shareUrl: string;
  isPast: boolean;
};

function cleanSlug(value: string) {
  const slug = String(value || "").trim();
  return /^ev_[A-Za-z0-9_-]{10,80}$/.test(slug) ? slug : "";
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function eventDescription(event: EventPreview | null) {
  if (!event) return "Open this ReSell Marketplace event in the app.";

  return [
    event.description,
    event.venueName || event.locationLabel,
    event.priceText,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 240) || "View this event on ReSell Marketplace.";
}

async function getEvent(slug: string): Promise<EventPreview | null> {
  const safeSlug = cleanSlug(slug);
  if (!safeSlug) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/events/public/${encodeURIComponent(safeSlug)}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.ok || !data?.event) return null;

    return data.event as EventPreview;
  } catch {
    return null;
  }
}

function InfoIcon({ type }: { type: "date" | "location" | "price" }) {
  const paths = {
    date: (
      <>
        <path d="M7 3.5v3M17 3.5v3" />
        <path d="M5.5 8.5h13" />
        <path d="M6.8 5.2h10.4c1.2 0 2.1.9 2.1 2.1v10.4c0 1.2-.9 2.1-2.1 2.1H6.8c-1.2 0-2.1-.9-2.1-2.1V7.3c0-1.2.9-2.1 2.1-2.1Z" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
        <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      </>
    ),
    price: (
      <>
        <path d="M4.8 11.2 11.2 4.8h7.1v7.1l-6.4 6.4a2 2 0 0 1-2.8 0l-4.3-4.3a2 2 0 0 1 0-2.8Z" />
        <path d="M15.7 8.3h.1" />
      </>
    ),
  };

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D19759]/35 bg-[#D19759]/15">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#D19759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths[type]}
      </svg>
    </span>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  const title = event ? `${event.title} | ReSell Marketplace` : "ReSell Marketplace Event";
  const description = eventDescription(event);
  const url = `${SITE_URL}/events/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    icons: {
      icon: "/resell-logo.png",
      apple: "/resell-logo.png",
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ReSell Marketplace",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-profile.png`,
          width: 1200,
          height: 630,
          alt: "ReSell Marketplace event",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-profile.png`],
    },
  };
}

export default async function EventSharePage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  const safeUrl = `${SITE_URL}/events/${encodeURIComponent(slug)}`;

  if (!event) {
    return (
      <main className="min-h-screen bg-[#0f1420] px-5 py-10 text-white">
        <section className="mx-auto flex max-w-xl flex-col items-center rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
          <Image src="/resell-logo.png" alt="ReSell Marketplace" width={82} height={82} priority className="rounded-2xl" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#D19759]">ReSell Marketplace</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Event unavailable</h1>
          <p className="mt-3 text-base leading-7 text-white/70">
            This event may have been deleted, expired, or made unavailable.
          </p>
          <Link href="/" className="mt-7 rounded-2xl bg-[#78A3D7] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
            Go to ReSell Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const locationText = event.venueName || event.locationLabel || "";
  const dateText = formatDate(event.startAt);

  return (
    <main className="min-h-screen bg-[#0f1420] px-5 py-10 text-white">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-[34px] border border-white/10 bg-[#1C2230] shadow-2xl">
        <div className="relative h-72 bg-[#1C2230]">
          {event.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.coverImageUrl} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image src="/resell-logo.png" alt="ReSell Marketplace" width={92} height={92} priority className="rounded-3xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1420]/25 to-[#1C2230]" />
        </div>

        <div className="p-7">
          <div className="flex items-center gap-3">
            <Image src="/resell-logo.png" alt="ReSell Marketplace" width={48} height={48} priority className="rounded-xl" />
            <div>
              <p className="text-sm font-bold text-[#D19759]">ReSell Marketplace Event</p>
              <p className="text-xs font-semibold text-white/50">Shared from ReSell</p>
            </div>
          </div>

          <p className="mt-6 text-sm font-bold text-[#D19759]">{dateText}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">{event.title}</h1>

          {event.isPast ? (
            <div className="mt-5 flex gap-3 rounded-2xl border border-[#D19759]/35 bg-[#D19759]/15 px-4 py-3">
              <InfoIcon type="date" />
              <p className="text-sm font-semibold leading-6 text-[#F2D6AE]">
                This event has ended. You can still view the details in ReSell.
              </p>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            {dateText ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <InfoIcon type="date" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Date and time</p>
                  <p className="mt-1 text-sm font-bold text-white/82">{dateText}</p>
                </div>
              </div>
            ) : null}

            {locationText ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <InfoIcon type="location" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Location</p>
                  <p className="mt-1 text-sm font-bold text-white/82">{locationText}</p>
                </div>
              </div>
            ) : null}

            {event.priceText ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <InfoIcon type="price" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Price</p>
                  <p className="mt-1 text-sm font-bold text-white/82">{event.priceText}</p>
                </div>
              </div>
            ) : null}
          </div>

          {event.description ? <p className="mt-6 text-base leading-7 text-white/72">{event.description}</p> : null}

          <a href={safeUrl} className="mt-8 block rounded-2xl bg-[#78A3D7] px-6 py-4 text-center text-base font-black text-white transition hover:opacity-90">
            Open in ReSell
          </a>

          <p className="mt-5 text-center text-xs leading-5 text-white/45">
            If the app is installed, this link opens the event in ReSell. If not, install ReSell Marketplace and sign in to respond.
          </p>
        </div>
      </section>
    </main>
  );
}

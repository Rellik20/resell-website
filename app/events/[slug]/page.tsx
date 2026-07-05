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

  return (
    <main className="min-h-screen bg-[#0f1420] px-5 py-10 text-white">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.06] shadow-2xl">
        <div className="relative h-72 bg-[#1C2230]">
          {event.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.coverImageUrl} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image src="/resell-logo.png" alt="ReSell Marketplace" width={92} height={92} priority className="rounded-3xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-[#0f1420]/20 to-[#0f1420]" />
        </div>

        <div className="p-7">
          <div className="flex items-center gap-3">
            <Image src="/resell-logo.png" alt="ReSell Marketplace" width={48} height={48} priority className="rounded-xl" />
            <div>
              <p className="text-sm font-bold text-[#D19759]">ReSell Marketplace Event</p>
              <p className="text-xs font-semibold text-white/50">Shared from ReSell</p>
            </div>
          </div>

          <p className="mt-6 text-sm font-bold text-[#D19759]">{formatDate(event.startAt)}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">{event.title}</h1>

          {event.isPast ? (
            <p className="mt-4 rounded-2xl border border-[#D19759]/35 bg-[#D19759]/15 px-4 py-3 text-sm font-semibold text-[#F2D6AE]">
              This event has ended. You can still view the details in ReSell.
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 text-sm font-semibold text-white/75">
            {event.venueName || event.locationLabel ? <p>📍 {event.venueName || event.locationLabel}</p> : null}
            {event.priceText ? <p>🏷️ {event.priceText}</p> : null}
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ListingGallery } from "./ListingGallery";
import { OpenInReSellButton } from "./OpenInReSellButton";

const SITE_URL =
  "https://www.resellmarketplace.app";

const API_BASE_URL =
  process.env.RESELL_API_BASE_URL ||
  "https://resell-v5y2.onrender.com";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ListingPreview = {
  id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  status: "active" | "sold";
  soldAt: string | null;
  locationLabel: string | null;
  createdAt: string;
  sellerUsername?: string;
  sellerFirstName?: string;
  sellerLastName?: string;
  sellerProfilePhotoUrl?: string;
  sellerIsPro?: boolean;
  sponsored?: boolean;
  isSponsored?: boolean;
  sponsoredListing?: boolean;
};

function cleanListingId(value: string) {
  const id =
    String(value || "").trim();

  return /^[a-fA-F0-9]{24}$/.test(id)
    ? id
    : "";
}

function safePhotoUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      String(item || "").trim()
    )
    .filter((url) =>
      /^https:\/\//i.test(url)
    )
    .slice(0, 12);
}

function formatPrice(value: number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "";
  }

  return amount.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits:
        Number.isInteger(amount)
          ? 0
          : 2,
    }
  );
}

function sellerName(
  listing: ListingPreview
) {
  return (
    [
      listing.sellerFirstName,
      listing.sellerLastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    listing.sellerUsername ||
    "ReSell seller"
  );
}

function listingDescription(
  listing: ListingPreview | null
) {
  if (!listing) {
    return "View this marketplace listing on ReSell.";
  }

  return [
    listing.description,
    listing.locationLabel,
    formatPrice(listing.price),
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 240);
}

async function getListing(
  id: string
): Promise<ListingPreview | null> {
  const safeId =
    cleanListingId(id);

  if (!safeId) {
    return null;
  }

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/listings/${encodeURIComponent(safeId)}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !data?.ok ||
      !data?.listing
    ) {
      return null;
    }

    return data.listing as ListingPreview;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } =
    await params;

  const listing =
    await getListing(id);

  const safeId =
    cleanListingId(id);

  const url =
    `${SITE_URL}/listings/${encodeURIComponent(safeId || id)}`;

  const title =
    listing
      ? `${listing.title} | ReSell Marketplace`
      : "ReSell Marketplace Listing";

  const description =
    listingDescription(listing);

  const image =
    safePhotoUrls(
      listing?.photos
    )[0] ||
    `${SITE_URL}/og-profile.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    icons: {
      icon: "/resell-logo.png",
      apple: "/resell-logo.png",
    },
    openGraph: {
      title,
      description,
      url,
      siteName:
        "ReSell Marketplace",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt:
            listing?.title ||
            "ReSell Marketplace listing",
        },
      ],
    },
    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function DetailIcon({
  type,
}: {
  type:
    | "price"
    | "location"
    | "seller";
}) {
  const paths = {
    price: (
      <>
        <path d="M4.8 11.2 11.2 4.8h7.1v7.1l-6.4 6.4a2 2 0 0 1-2.8 0l-4.3-4.3a2 2 0 0 1 0-2.8Z" />
        <path d="M15.7 8.3h.1" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
        <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      </>
    ),
    seller: (
      <>
        <circle
          cx="12"
          cy="8"
          r="3.5"
        />
        <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
      </>
    ),
  };

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#78A3D7]/35 bg-[#78A3D7]/15">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="#78A3D7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[type]}
      </svg>
    </span>
  );
}

export default async function ListingSharePage({
  params,
}: PageProps) {
  const { id } =
    await params;

  const listing =
    await getListing(id);

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#0f1420] px-5 py-10 text-white">
        <section className="mx-auto flex max-w-xl flex-col items-center rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
          <Image
            src="/resell-logo.png"
            alt="ReSell Marketplace"
            width={82}
            height={82}
            priority
            className="rounded-2xl"
          />

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#78A3D7]">
            ReSell Marketplace
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Listing unavailable
          </h1>

          <p className="mt-3 text-base leading-7 text-white/70">
            This listing may have been removed, hidden, or made unavailable.
          </p>

          <Link
            href="/"
            className="mt-7 rounded-2xl bg-[#78A3D7] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Go to ReSell Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const photos =
    safePhotoUrls(
      listing.photos
    );

  const price =
    formatPrice(listing.price);

  const seller =
    sellerName(listing);

  const isSponsored =
    Boolean(
      listing.sponsored ||
      listing.isSponsored ||
      listing.sponsoredListing
    );

  return (
    <main className="min-h-screen bg-[#0f1420] px-5 py-10 text-white">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-[34px] border border-white/10 bg-[#1C2230] shadow-2xl">
        <ListingGallery
          photos={photos}
          title={listing.title}
          status={listing.status}
          isSponsored={isSponsored}
        />

        <div className="p-7">
          <div className="flex items-center gap-3">
            <Image
              src="/resell-logo.png"
              alt="ReSell Marketplace"
              width={48}
              height={48}
              priority
              className="rounded-xl"
            />

            <div>
              <p className="text-sm font-bold text-[#78A3D7]">
                ReSell Marketplace Listing
              </p>

              <p className="text-xs font-semibold text-white/50">
                Shared from ReSell
              </p>
            </div>
          </div>

          <h1 className="mt-6 break-words text-4xl font-black leading-tight tracking-tight">
            {listing.title}
          </h1>

          <div className="mt-6 flex flex-col gap-3">
            {price ? (
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <DetailIcon type="price" />

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                    Price
                  </p>

                  <p className="mt-1 text-base font-bold text-white/85">
                    {price}
                  </p>
                </div>
              </div>
            ) : null}

            {listing.locationLabel ? (
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <DetailIcon type="location" />

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                    Location
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-white/85">
                    {listing.locationLabel}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <DetailIcon type="seller" />

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                  Seller
                </p>

                <p className="mt-1 break-words text-sm font-bold text-white/85">
                  {seller}
                  {listing.sellerUsername
                    ? ` · @${listing.sellerUsername}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {listing.description ? (
            <p className="mt-6 whitespace-pre-wrap break-words text-base leading-7 text-white/72">
              {listing.description}
            </p>
          ) : null}

          <OpenInReSellButton
            listingId={listing.id}
            className="mt-8 block rounded-2xl bg-[#78A3D7] px-6 py-4 text-center text-base font-black text-white transition hover:opacity-90"
          />

          <p className="mt-5 text-center text-xs leading-5 text-white/45">
            If ReSell is installed, this link opens the listing directly in the app.
          </p>
        </div>
      </section>
    </main>
  );
}

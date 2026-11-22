import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../../components/SiteChrome";
import { OpenInReSellButton } from "../../../components/OpenInReSellButton";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.resellmarketplace.app";

const API_BASE_URL =
  process.env.RESELL_API_BASE_URL ||
  "https://resell-v5y2.onrender.com";

type PageProps = {
  params: Promise<{ id: string }>;
};

type SocialPreview = {
  id: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl: string;
  };
};

function cleanPostId(value: string) {
  const id = String(value || "").trim();

  return /^[a-fA-F0-9]{24}$/.test(id) ? id : "";
}

function safeImageUrl(value: unknown) {
  if (typeof value !== "string") return "";

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}

function displayName(author: SocialPreview["author"]) {
  return (
    [author.firstName, author.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    author.username ||
    "ReSell member"
  );
}

function descriptionFor(post: SocialPreview) {
  const text = post.text.replace(/\s+/g, " ").trim();

  return (
    text.slice(0, 220) ||
    "See this Social post on ReSell Marketplace."
  );
}

function renderPostText(text: string) {
  return text
    .split(/(https?:\/\/[^\s<>]+|www\.[^\s<>]+)/gi)
    .map((part, index) => {
      if (!/^(https?:\/\/|www\.)/i.test(part)) {
        return part;
      }

      const visible = part.replace(/[.,!?;:)\]]+$/, "");
      const href = /^www\./i.test(visible)
        ? `https://${visible}`
        : visible;

      try {
        const url = new URL(href);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          return part;
        }
      } catch {
        return part;
      }

      return (
        <span key={`social-link-${index}`}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer ugc nofollow"
            className="break-all font-medium text-[#78A3D7] underline underline-offset-4 hover:text-white"
          >
            {visible}
          </a>
          {part.slice(visible.length)}
        </span>
      );
    });
}

function formattedDate(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "ReSell Social";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function getSocialPost(
  id: string
): Promise<SocialPreview | null> {
  const safeId = cleanPostId(id);

  if (!safeId) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${encodeURIComponent(
        safeId
      )}/preview`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const raw = data?.post;

    if (
      data?.ok !== true ||
      !raw ||
      String(raw.id || "").toLowerCase() !==
        safeId.toLowerCase() ||
      typeof raw.text !== "string" ||
      !raw.author ||
      typeof raw.author !== "object"
    ) {
      return null;
    }

    return {
      id: safeId,
      text: raw.text.slice(0, 300),
      imageUrl: safeImageUrl(raw.imageUrl),
      createdAt: String(raw.createdAt || ""),
      author: {
        username: String(raw.author.username || "").slice(0, 50),
        firstName: String(raw.author.firstName || "").slice(0, 100),
        lastName: String(raw.author.lastName || "").slice(0, 100),
        profilePhotoUrl: safeImageUrl(raw.author.profilePhotoUrl),
      },
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getSocialPost(id);

  const safeId = cleanPostId(id);
  const url = safeId
    ? `${SITE_URL}/social/posts/${encodeURIComponent(safeId)}`
    : `${SITE_URL}/`;

  const title = post
    ? `${displayName(post.author)} on ReSell Social`
    : "Social post unavailable | ReSell Marketplace";

  const description = post
    ? descriptionFor(post)
    : "This ReSell Social post is unavailable.";

  const image = post && safeId
    ? `${SITE_URL}/social/posts/${encodeURIComponent(
        safeId
      )}/opengraph-image`
    : `${SITE_URL}/og-profile.png`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ReSell Marketplace",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post
            ? `Social post by ${displayName(post.author)}`
            : "ReSell Marketplace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SocialPostSharePage({
  params,
}: PageProps) {
  const { id } = await params;
  const post = await getSocialPost(id);

  if (!post) {
    return (
      <main className="site-shell resell-interior min-h-screen">
        <SiteHeader />

        <section className="rs-rise mx-auto flex w-full max-w-[680px] flex-col items-center px-4 pb-24 pt-14 text-center sm:pt-20">
          <div className="w-full rounded-[28px] border border-white/10 bg-[#121720] px-6 py-12 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-12 sm:py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/10 bg-[#1B2330]">
              <Image
                src="/resell-logo.png"
                width={62}
                height={62}
                alt="ReSell Marketplace"
                className="rounded-2xl"
                priority
              />
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#3869A8]/45 bg-[#17263A] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#65A5FF]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#B9D6FF]">
                ReSell Social
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Post unavailable
            </h1>

            <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-[#BBC5D5]">
              This post may have been deleted, removed, hidden,
              or is no longer available.
            </p>

            <Link
              href="/"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#3478EB] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(35,102,218,0.25)] transition-colors hover:bg-[#4C91FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8BBAFF]"
            >
              Explore ReSell Marketplace
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    );
  }

  const name = displayName(post.author);
  const username = post.author.username.trim();
  const imageUrl = safeImageUrl(post.imageUrl);
  const avatarUrl = safeImageUrl(post.author.profilePhotoUrl);
  const initials =
    name
      .split(/\\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "R";

  return (
    <main className="site-shell resell-interior min-h-screen">
      <SiteHeader />

      <section className="rs-rise relative mx-auto w-full max-w-[790px] px-1 pb-20 pt-8 sm:px-4 sm:pt-14">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:mb-9 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3869A8]/45 bg-[#142337] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#BFDBFE]">
                ReSell Social
              </span>
            </div>

            <h1 className="mt-4 text-[29px] font-extrabold tracking-[-0.04em] text-white sm:text-[39px]">
              A conversation worth sharing.
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#B7C2D3] sm:text-[15px]">
              Discover what the ReSell community is talking about.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 bg-[#171C26] px-4 py-2.5 text-xs font-semibold text-[#E6EBF4] transition-colors hover:border-white/30 hover:bg-[#222B39]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Marketplace
          </Link>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#141922] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
          <div className="h-[3px] bg-[#3B82F6]" />

          <div className="flex items-center gap-3.5 border-b border-white/[0.08] px-5 py-5 sm:px-7 sm:py-6">
            <div className="relative flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#638CC7]/45 bg-[#253955] text-[16px] font-extrabold tracking-[0.02em] text-white shadow-[0_0_0_4px_rgba(59,130,246,0.08)]">
              {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${name} profile picture`}
                    fill
                    sizes="54px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold tracking-tight text-white sm:text-[17px]">
                {name}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#AAB8CA]">
                {username ? (
                  <Link
                    href={`/u/${encodeURIComponent(username)}`}
                    className="font-semibold text-[#A6CCFF] transition-colors hover:text-white"
                  >
                    @{username}
                  </Link>
                ) : null}

                {username ? (
                  <span className="text-white/25">/</span>
                ) : null}

                <span>{formattedDate(post.createdAt)}</span>
              </div>
            </div>

            <span className="hidden shrink-0 rounded-full border border-white/10 bg-[#1D2634] px-3 py-1.5 text-[11px] font-semibold text-[#C2D2E8] sm:inline-flex">
              Community post
            </span>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <p className="whitespace-pre-wrap break-words text-[17px] font-medium leading-[1.9] tracking-[-0.01em] text-[#F5F7FB] sm:text-[19px]">
              {renderPostText(post.text)}
            </p>
          </div>

          {imageUrl ? (
            <div className="border-y border-white/[0.08] bg-[#0D121A] p-3 sm:p-5">
              <div className="overflow-hidden rounded-2xl bg-[#080B11]">
                <Image
                  src={imageUrl}
                  alt={`Photo shared by ${name}`}
                  width={1200}
                  height={900}
                  unoptimized
                  className="mx-auto h-auto max-h-[720px] w-full object-contain"
                />
              </div>
            </div>
          ) : null}

          <div className="border-t border-white/[0.09] bg-[#101722] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4474B8]/35 bg-[#1C3050] text-[#9EC7FF]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M8 10h8M8 14h5" />
                  <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold tracking-tight text-white sm:text-[16px]">
                  Join the conversation
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-[#B1BED0]">
                  Open ReSell to read the discussion and connect
                  with the community.
                </p>
              </div>
            </div>

            <OpenInReSellButton
              routePath={`social/posts/${post.id}`}
              className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#3478EB] px-6 py-3.5 text-[14px] font-bold tracking-[0.01em] text-white shadow-[0_12px_28px_rgba(35,102,218,0.27)] transition-colors hover:bg-[#4C91FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8BBAFF]"
            >
              Open in ReSell
            </OpenInReSellButton>
          </div>
        </article>

        <p className="mx-auto mt-7 max-w-lg text-center text-[12px] leading-6 text-[#A8B3C4]">
          Shared from ReSell Marketplace. Unavailable or removed
          content cannot be viewed here.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

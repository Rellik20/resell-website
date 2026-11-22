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

        <section className="rs-rise mx-auto my-16 flex max-w-xl flex-col items-center px-4 py-12 text-center">
          <Image
            src="/resell-logo.png"
            alt="ReSell Marketplace"
            width={64}
            height={64}
            priority
            className="rounded-2xl"
          />

          <h1 className="mt-6 text-3xl font-semibold text-white">
            Post unavailable
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#A9AFBC]">
            This post may have been deleted, removed, hidden,
            or is no longer available.
          </p>
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

      <section className="rs-rise mx-auto my-12 w-full max-w-xl px-4 pb-14 sm:px-8">
        <header className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A4149] text-base font-semibold text-white">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${name} profile picture`}
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-white">
              {name}
            </p>

            {username ? (
              <Link
                href={`/u/${encodeURIComponent(username)}`}
                className="mt-0.5 inline-block text-sm text-[#A9AFBC] transition-colors hover:text-white"
              >
                @{username}
              </Link>
            ) : null}

            <p className="mt-1 text-xs text-[#A9AFBC]">
              {formattedDate(post.createdAt)}
            </p>
          </div>
        </header>

        <article className="pt-7">
          <p className="whitespace-pre-wrap break-words text-base leading-7 text-white">
            {renderPostText(post.text)}
          </p>

          {imageUrl ? (
            <div className="mt-6 overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={`Photo shared by ${name}`}
                width={1200}
                height={900}
                unoptimized
                className="h-auto max-h-[680px] w-full object-contain"
              />
            </div>
          ) : null}
        </article>

        <div className="mt-10 border-t border-white/10 pt-7 text-center">
          <p className="text-sm leading-6 text-[#A9AFBC]">
            View this post and its replies in the ReSell app.
          </p>

          <OpenInReSellButton
            routePath={`social/posts/${post.id}`}
            className="mt-6 inline-flex w-full max-w-[260px] items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open in ReSell
          </OpenInReSellButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

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

        <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center">
          <Image
            src="/resell-logo.png"
            width={78}
            height={78}
            alt="ReSell Marketplace"
            className="rounded-2xl"
            priority
          />

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#78A3D7]">
            ReSell Social
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Post unavailable
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            This post may have been deleted, removed, hidden,
            or is no longer available.
          </p>

          <Link
            href="/"
            className="mt-8 rounded-2xl bg-[#78A3D7] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Explore ReSell Marketplace
          </Link>
        </section>

        <SiteFooter />
      </main>
    );
  }

  const name = displayName(post.author);
  const username = post.author.username.trim();
  const imageUrl = safeImageUrl(post.imageUrl);
  const initial = name.charAt(0).toUpperCase() || "R";

  return (
    <main className="site-shell resell-interior min-h-screen">
      <SiteHeader />

      <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#78A3D7]">
            ReSell Social
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            A post from the ReSell community
          </h1>
        </div>

        <article className="overflow-hidden rounded-[26px] border border-white/10 bg-[#171A20] shadow-2xl">
          <div className="flex items-center gap-3 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#243C58] text-lg font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">
                {name}
              </p>

              <p className="mt-0.5 text-xs text-white/55">
                {username ? `@${username} · ` : ""}
                {formattedDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 sm:px-6">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-white/90">
              {renderPostText(post.text)}
            </p>
          </div>

          {imageUrl ? (
            <div className="border-t border-white/10 bg-black/30">
              <Image
                src={imageUrl}
                alt={`Photo shared by ${name}`}
                width={1200}
                height={900}
                unoptimized
                className="h-auto max-h-[720px] w-full object-contain"
              />
            </div>
          ) : null}

          <div className="border-t border-white/10 p-5 sm:p-6">
            <p className="mb-4 text-sm leading-6 text-white/65">
              Open this post in ReSell to view the discussion
              and interact with the community.
            </p>

            <OpenInReSellButton
              routePath={`social/posts/${post.id}`}
              className="w-full rounded-2xl bg-[#78A3D7] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Open in ReSell
            </OpenInReSellButton>
          </div>
        </article>

        <p className="mt-6 text-center text-xs leading-6 text-white/45">
          Social posts are shared by ReSell members.
          Unavailable or removed content cannot be viewed here.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const API_BASE_URL =
  process.env.RESELL_API_BASE_URL ||
  "https://resell-v5y2.onrender.com";

type PreviewResponse = {
  ok?: boolean;
  post?: {
    id?: string;
    text?: string;
    author?: {
      username?: string;
      firstName?: string;
      lastName?: string;
    };
  };
};

async function getPreview(id: string) {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${encodeURIComponent(
        id
      )}/preview`,
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
      (await response.json()) as PreviewResponse;

    if (
      data.ok !== true ||
      !data.post ||
      String(data.post.id || "").toLowerCase() !==
        id.toLowerCase() ||
      typeof data.post.text !== "string"
    ) {
      return null;
    }

    return data.post;
  } catch {
    return null;
  }
}

export default async function SocialPostImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getPreview(id);

  let logoSrc = "";

  try {
    const logo = await readFile(
      join(process.cwd(), "public", "resell-logo.png")
    );

    logoSrc = `data:image/png;base64,${logo.toString(
      "base64"
    )}`;
  } catch {
    // The branded text remains if the logo cannot load.
  }

  const authorName = post
    ? [
        post.author?.firstName,
        post.author?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      post.author?.username ||
      "ReSell member"
    : "";

  const fullText = post
    ? String(post.text || "")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  const excerpt = post
    ? fullText.slice(0, 165) +
      (fullText.length > 165 ? "..." : "")
    : "This Social post is no longer available.";

  const headline =
    excerpt ||
    "A post from the ReSell community";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 66px",
          backgroundColor: "#0F1115",
          color: "#F5F6F8",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              width={78}
              height={78}
              alt=""
              style={{
                borderRadius: 18,
                objectFit: "contain",
              }}
            />
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: logoSrc ? 20 : 0,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              ReSell
            </div>
            <div
              style={{
                fontSize: 17,
                color: "#78A3D7",
                letterSpacing: 3,
              }}
            >
              SOCIAL
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 25,
              color: "#78A3D7",
              marginBottom: 18,
            }}
          >
            {post
              ? `Post by ${authorName}`
              : "ReSell Marketplace"}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 47,
              fontWeight: 700,
              lineHeight: 1.22,
              overflow: "hidden",
              maxHeight: 235,
              overflowWrap: "break-word",
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #343946",
            paddingTop: 22,
            color: "#A9B0BC",
            fontSize: 19,
          }}
        >
          <span>ReSell Marketplace</span>
          <span>resellmarketplace.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

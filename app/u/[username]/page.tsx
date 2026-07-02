import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://resellmarketplace.app";
const API_BASE_URL = process.env.RESELL_API_BASE_URL || "https://resell-v5y2.onrender.com";

type PublicUser = {
  username: string;
  firstName: string;
  lastName: string;
  country: string;
  bio: string;
  profilePhotoUrl: string;
  verified: boolean;
};

function cleanUsername(value: string) {
  return String(value || "").trim().replace(/^@+/, "");
}

function displayName(user: PublicUser) {
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    "ReSell user"
  );
}

async function getPublicUser(username: string): Promise<PublicUser | null> {
  const clean = cleanUsername(username);

  if (!/^[a-zA-Z0-9._]{3,12}$/.test(clean)) {
    return null;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/users/public/username/${encodeURIComponent(clean)}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.ok || !data?.user) return null;

    return data.user as PublicUser;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getPublicUser(username);
  const clean = cleanUsername(username);
  const name = user ? displayName(user) : "ReSell Profile";
  const handle = user?.username ? `@${user.username}` : "";
  const title = user ? `${name} ${handle} on ReSell Marketplace` : "ReSell Marketplace Profile";
  const description = user?.bio
    ? user.bio
    : "View this public ReSell Marketplace profile. Browse local listings, discover nearby finds, and message buyers or sellers in the ReSell app.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/u/${encodeURIComponent(clean)}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/u/${encodeURIComponent(clean)}`,
      siteName: "ReSell Marketplace",
      type: "profile",
      images: [
        {
          url: `${SITE_URL}/resell-logo.png`,
          width: 1200,
          height: 1200,
          alt: "ReSell Marketplace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/resell-logo.png`],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getPublicUser(username);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#141823] px-6 py-10 text-white">
        <section className="mx-auto flex max-w-xl flex-col items-center rounded-[28px] border border-white/10 bg-[#1C222E] p-8 text-center shadow-2xl">
          <Image src="/resell-logo.png" alt="ReSell Marketplace" width={88} height={88} priority className="rounded-2xl" />
          <h1 className="mt-6 text-3xl font-semibold">Profile not found</h1>
          <p className="mt-3 text-sm leading-6 text-[#A9AFBC]">
            This ReSell profile may not exist yet, or the user may have changed their username.
          </p>
          <Link href="/" className="mt-7 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#141823]">
            Go to ReSell Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const name = displayName(user);

  return (
    <main className="min-h-screen bg-[#141823] px-6 py-10 text-white">
      <section className="mx-auto max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[#1C222E] shadow-2xl">
        <div className="bg-gradient-to-b from-[#3E454E] to-transparent px-8 pb-10 pt-8 text-center">
          <Image src="/resell-logo.png" alt="ReSell Marketplace" width={64} height={64} priority className="mx-auto rounded-2xl" />

          <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#3A4149] ring-4 ring-white/10">
            {user.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profilePhotoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">{name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight">{name}</h1>
          <p className="mt-2 text-lg text-[#DADEE3]">@{user.username}</p>

          <div className="mt-5 flex justify-center gap-3">
            {user.country ? (
              <span className="rounded-full bg-[#464775] px-4 py-2 text-sm text-white">{user.country}</span>
            ) : null}
            {user.verified ? (
              <span className="rounded-full bg-[#5B414F] px-4 py-2 text-sm text-white">Verified</span>
            ) : null}
          </div>

          {user.bio ? (
            <p className="mx-auto mt-6 max-w-md text-base leading-7 text-[#A9AFBC]">{user.bio}</p>
          ) : null}
        </div>

        <div className="px-8 pb-8 text-center">
          <p className="text-sm leading-6 text-[#A9AFBC]">
            Open ReSell Marketplace to browse listings, save favorites, and message buyers or sellers directly.
          </p>
          <Link href="/" className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#141823]">
            Open ReSell Marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}

"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";

type ListingGalleryProps = {
  photos: string[];
  title: string;
  status: "active" | "sold";
  isSponsored: boolean;
};

function clampIndex(
  value: number,
  length: number
) {
  return Math.max(
    0,
    Math.min(
      Math.max(length - 1, 0),
      value
    )
  );
}

function scrollToIndex(
  ref: RefObject<HTMLDivElement | null>,
  index: number,
  behavior: ScrollBehavior
) {
  const node = ref.current;

  if (!node) {
    return;
  }

  node.scrollTo({
    left:
      clampIndex(
        index,
        node.children.length
      ) * node.clientWidth,
    behavior,
  });
}

export function ListingGallery({
  photos,
  title,
  status,
  isSponsored,
}: ListingGalleryProps) {
  const viewerRef =
    useRef<HTMLDivElement>(null);

  const activeIndexRef =
    useRef(0);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [viewerOpen, setViewerOpen] =
    useState(false);

  function updateIndex(index: number) {
    const next =
      clampIndex(
        index,
        photos.length
      );

    activeIndexRef.current =
      next;

    setActiveIndex(next);
  }

  function handleScroll(
    event: UIEvent<HTMLDivElement>
  ) {
    const node =
      event.currentTarget;

    if (!node.clientWidth) {
      return;
    }

    updateIndex(
      Math.round(
        node.scrollLeft /
          node.clientWidth
      )
    );
  }

  function moveViewer(
    direction: -1 | 1
  ) {
    const next =
      clampIndex(
        activeIndexRef.current +
          direction,
        photos.length
      );

    updateIndex(next);

    scrollToIndex(
      viewerRef,
      next,
      "smooth"
    );
  }

  function openViewer(
    index: number
  ) {
    updateIndex(index);
    setViewerOpen(true);
  }

  function closeViewer() {
    setViewerOpen(false);
  }

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const frame =
      requestAnimationFrame(() => {
        scrollToIndex(
          viewerRef,
          activeIndexRef.current,
          "auto"
        );
      });

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        moveViewer(-1);
      }

      if (event.key === "ArrowRight") {
        moveViewer(1);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [viewerOpen]);

  if (!photos.length) {
    return (
      <div className="flex h-[200px] items-center justify-center bg-[#0B0D12] sm:h-[240px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/resell-logo.png"
          alt="ReSell Marketplace"
          className="h-24 w-24 rounded-3xl"
        />
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#1C2230]">
        <button
          type="button"
          onClick={() =>
            openViewer(0)
          }
          className="relative block h-[340px] w-full overflow-hidden bg-[#1C2230] text-left"
          aria-label={`Open all ${title} photos`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[0]}
            alt={`${title} listing photo`}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1C2230]/45" />
        </button>

        {status === "sold" ? (
          <span className="absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
            Sold
          </span>
        ) : isSponsored ? (
          <span className="absolute left-4 top-4 z-20 rounded-full border border-[#78A3D7]/40 bg-[#1C2230]/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#AFCDF3]">
            Sponsored
          </span>
        ) : null}

        <span className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full border border-white/15 bg-black/65 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur-sm">
          Tap to expand
        </span>

        {photos.length > 1 ? (
          <span className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
            1 of {photos.length}
          </span>
        ) : null}
      </section>

      {viewerOpen ? (
        <div
          className="fixed inset-0 z-[100] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
        >
          <div
            className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pb-4"
            style={{
              paddingTop:
                "max(18px, env(safe-area-inset-top))",
            }}
          >
            <button
              type="button"
              onClick={closeViewer}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/65 text-2xl text-white backdrop-blur-sm"
              aria-label="Close image viewer"
            >
              ×
            </button>

            <span className="rounded-full border border-white/15 bg-black/65 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
              {activeIndex + 1} of{" "}
              {photos.length}
            </span>

            <span
              className="h-11 w-11"
              aria-hidden="true"
            />
          </div>

          <div
            ref={viewerRef}
            onScroll={handleScroll}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            style={{
              scrollbarWidth: "none",
            }}
          >
            {photos.map(
              (
                photoUrl,
                index
              ) => (
                <div
                  key={`viewer-${photoUrl}-${index}`}
                  className="flex h-full min-w-full shrink-0 snap-center items-center justify-center bg-black px-2 pb-8 pt-20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={`${title} full-screen photo ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )
            )}
          </div>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  moveViewer(-1)
                }
                disabled={
                  activeIndex === 0
                }
                className="absolute left-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-3xl text-white backdrop-blur-sm transition disabled:opacity-25 sm:flex"
                aria-label="Previous full-screen photo"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() =>
                  moveViewer(1)
                }
                disabled={
                  activeIndex ===
                  photos.length - 1
                }
                className="absolute right-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-3xl text-white backdrop-blur-sm transition disabled:opacity-25 sm:flex"
                aria-label="Next full-screen photo"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

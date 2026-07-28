"use client";

import {
  useRef,
} from "react";

const IOS_APP_STORE_URL =
  "https://apps.apple.com/us/app/resell-marketplace/id6759349548";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.rellik20.mobile";

type OpenInReSellButtonProps = {
  listingId: string;
  className?: string;
};

function isIOSDevice() {
  const userAgent =
    navigator.userAgent || "";

  return (
    /iPad|iPhone|iPod/i.test(
      userAgent
    ) ||
    (
      navigator.platform ===
        "MacIntel" &&
      navigator.maxTouchPoints > 1
    )
  );
}

function isAndroidDevice() {
  return /Android/i.test(
    navigator.userAgent || ""
  );
}

export function OpenInReSellButton({
  listingId,
  className,
}: OpenInReSellButtonProps) {
  const fallbackTimerRef =
    useRef<number | null>(
      null
    );

  function clearFallbackTimer() {
    if (
      fallbackTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        fallbackTimerRef.current
      );

      fallbackTimerRef.current =
        null;
    }
  }

  function openInReSell() {
    clearFallbackTimer();

    const safeListingId =
      encodeURIComponent(
        String(listingId || "")
      );

    if (!safeListingId) {
      return;
    }

    /*
     * Android intent URLs support an explicit Play Store fallback.
     */
    if (isAndroidDevice()) {
      const playFallback =
        encodeURIComponent(
          GOOGLE_PLAY_URL
        );

      window.location.href =
        `intent://listings/${safeListingId}` +
        `#Intent;scheme=resell;` +
        `package=com.rellik20.mobile;` +
        `S.browser_fallback_url=${playFallback};end`;

      return;
    }

    /*
     * iOS attempts the ReSell custom scheme first. When the app opens,
     * the browser becomes hidden and the App Store fallback is canceled.
     */
    if (isIOSDevice()) {
      const handleVisibilityChange =
        () => {
          if (document.hidden) {
            clearFallbackTimer();

            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
          }
        };

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      fallbackTimerRef.current =
        window.setTimeout(() => {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );

          if (!document.hidden) {
            window.location.href =
              IOS_APP_STORE_URL;
          }
        }, 1400);

      window.location.href =
        `resell://listings/${safeListingId}`;

      return;
    }

    /*
     * Desktop visitors are directed to the appropriate public store.
     */
    const isAppleDesktop =
      /Macintosh|Mac OS X/i.test(
        navigator.userAgent || ""
      );

    window.location.href =
      isAppleDesktop
        ? IOS_APP_STORE_URL
        : GOOGLE_PLAY_URL;
  }

  return (
    <button
      type="button"
      onClick={openInReSell}
      className={className}
    >
      Open in ReSell
    </button>
  );
}

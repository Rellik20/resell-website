"use client";

import { useRef } from "react";

const IOS_APP_STORE_URL =
  "https://apps.apple.com/us/app/resell-marketplace/id6759349548";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.rellik20.mobile";

type OpenInReSellButtonProps = {
  routePath: string;
  className?: string;
  children?: React.ReactNode;
};

function isIOSDevice() {
  const userAgent = navigator.userAgent || "";

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    )
  );
}

function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent || "");
}

function safeRoutePath(value: string) {
  return String(value || "")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join("/");
}

export function OpenInReSellButton({
  routePath,
  className,
  children = "Open in ReSell",
}: OpenInReSellButtonProps) {
  const fallbackTimerRef = useRef<number | null>(null);

  function clearFallbackTimer() {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }

  function openInReSell() {
    clearFallbackTimer();

    const safePath = safeRoutePath(routePath);

    if (!safePath) {
      return;
    }

    if (isAndroidDevice()) {
      const playFallback = encodeURIComponent(GOOGLE_PLAY_URL);

      window.location.href =
        `intent://${safePath}` +
        `#Intent;scheme=resell;` +
        `package=com.rellik20.mobile;` +
        `S.browser_fallback_url=${playFallback};end`;

      return;
    }

    if (isIOSDevice()) {
      const handleVisibilityChange = () => {
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

      fallbackTimerRef.current = window.setTimeout(() => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        if (!document.hidden) {
          window.location.href = IOS_APP_STORE_URL;
        }
      }, 1400);

      window.location.href = `resell://${safePath}`;
      return;
    }

    const isAppleDesktop =
      /Macintosh|Mac OS X/i.test(navigator.userAgent || "");

    window.location.href =
      isAppleDesktop ? IOS_APP_STORE_URL : GOOGLE_PLAY_URL;
  }

  return (
    <button
      type="button"
      onClick={openInReSell}
      className={className}
    >
      {children}
    </button>
  );
}

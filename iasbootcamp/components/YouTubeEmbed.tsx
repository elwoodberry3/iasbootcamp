"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track, type TrackEvent } from "@/lib/track";

/**
 * YouTubeEmbed — enterprise-grade "lite embed" (facade pattern).
 *
 * Why not the out-of-the-box <iframe> embed:
 *  - The default embed loads ~1MB+ of YouTube JS and sets cookies on page load,
 *    before the user has expressed any intent. That tanks LCP/CLS and creates a
 *    consent-tracking liability.
 *  - This component renders a static poster (thumbnail) + accessible play button
 *    and ONLY injects the player iframe on user click. Zero third-party requests
 *    until intent (Governance / performance + privacy by design).
 *  - Uses youtube-nocookie.com (privacy-enhanced mode) and preconnects the video
 *    origins so first-click playback stays fast.
 *  - After activation it loads the YouTube IFrame API and fires the same funnel
 *    milestones the <video> path fires (play / 25 / 50 / 75 / complete) into
 *    /api/track → n8n, so retargeting audiences work identically for YouTube VSLs.
 *
 * Honesty note (Article IX): pass a real 11-char YouTube ID. If none exists yet,
 * render <VideoFrame> with a todoLabel instead — never a fake thumbnail.
 */

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => YtPlayer;
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YtPlayer = {
  getDuration: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
};

const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/** Extract a clean 11-char video ID from an ID or any YouTube URL form. */
export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  if (YT_ID_RE.test(input)) return input;
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return YT_ID_RE.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && YT_ID_RE.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((p) => ["embed", "shorts", "live", "v"].includes(p));
      if (marker !== -1 && parts[marker + 1] && YT_ID_RE.test(parts[marker + 1])) {
        return parts[marker + 1];
      }
    }
  } catch {
    /* not a URL */
  }
  return null;
}

let apiReadyPromise: Promise<void> | null = null;

/** Load the YouTube IFrame API exactly once, shared across all embeds. */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });
  return apiReadyPromise;
}

export function YouTubeEmbed({
  id,
  title = "Video",
  onCtaReady,
  eventPrefix = "vsl",
}: {
  /** 11-char YouTube video ID, or a full YouTube URL. */
  id: string;
  title?: string;
  /** Fired once when 75% is reached (used to reveal the sticky CTA). */
  onCtaReady?: () => void;
  /** Namespace for milestone events. "vsl" keeps parity with the <video> path. */
  eventPrefix?: string;
}) {
  const videoId = parseYouTubeId(id);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const fired = useRef<Set<string>>(new Set());
  const [activated, setActivated] = useState(false);

  const fireOnce = useCallback((key: string, fn: () => void) => {
    if (fired.current.has(key)) return;
    fired.current.add(key);
    fn();
  }, []);

  // Preconnect to the video origins once mounted so first click is fast,
  // without loading any third-party JS up front.
  useEffect(() => {
    if (!videoId) return;
    const origins = [
      "https://www.youtube-nocookie.com",
      "https://www.google.com",
      "https://i.ytimg.com",
      "https://fonts.gstatic.com",
    ];
    const links: HTMLLinkElement[] = origins.map((href) => {
      const l = document.createElement("link");
      l.rel = "preconnect";
      l.href = href;
      document.head.appendChild(l);
      return l;
    });
    return () => links.forEach((l) => l.remove());
  }, [videoId]);

  const activate = useCallback(async () => {
    if (activated || !videoId || !hostRef.current) return;
    setActivated(true);

    await loadYouTubeApi();
    if (!hostRef.current || !window.YT?.Player) return;

    const mount = document.createElement("div");
    hostRef.current.innerHTML = "";
    hostRef.current.appendChild(mount);

    playerRef.current = new window.YT.Player(mount, {
      videoId,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onStateChange: (e: { data: number }) => {
          const YT = window.YT!;
          if (e.data === YT.PlayerState.PLAYING) {
            fireOnce("play", () => track(`${eventPrefix}_play` as TrackEvent));
            if (pollRef.current == null) {
              pollRef.current = window.setInterval(() => {
                const p = playerRef.current;
                if (!p) return;
                const dur = p.getDuration();
                if (!dur) return;
                const pct = p.getCurrentTime() / dur;
                if (pct >= 0.25) fireOnce("25", () => track(`${eventPrefix}_25` as TrackEvent));
                if (pct >= 0.5) fireOnce("50", () => track(`${eventPrefix}_50` as TrackEvent));
                if (pct >= 0.75)
                  fireOnce("75", () => {
                    track(`${eventPrefix}_75` as TrackEvent);
                    onCtaReady?.();
                  });
              }, 1000);
            }
          }
          if (e.data === YT.PlayerState.ENDED) {
            fireOnce("complete", () => track(`${eventPrefix}_complete` as TrackEvent));
          }
        },
      },
    });
  }, [activated, videoId, eventPrefix, fireOnce, onCtaReady]);

  useEffect(() => {
    return () => {
      if (pollRef.current != null) window.clearInterval(pollRef.current);
      playerRef.current?.destroy?.();
    };
  }, []);

  if (!videoId) {
    // Fail honest: never render a fake player for a bad/empty ID.
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-hair bg-ash">
        <p className="font-mono text-xs text-muted">Invalid video reference</p>
      </div>
    );
  }

  // maxresdefault falls back to hqdefault automatically via onError below.
  const poster = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-hair bg-black">
      {/* Player mount — populated on activation. */}
      <div ref={hostRef} className="absolute inset-0 h-full w-full [&>*]:h-full [&>*]:w-full" />

      {!activated && (
        <button
          type="button"
          onClick={activate}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            aria-hidden
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.includes("hqdefault")) {
                img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-primary/20 transition group-hover:bg-primary/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 5v14l11-7z" fill="#0A2E36" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

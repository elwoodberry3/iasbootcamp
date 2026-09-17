"use client";

import { useEffect } from "react";
import { funnel } from "@/lib/funnel.config";
import { track } from "@/lib/track";
import { VideoFrame } from "@/components/VideoFrame";
import { SiteFooter } from "@/components/SiteFooter";

export default function ThankYouPage() {
  useEffect(() => {
    // Conversion confirmation event — this is where ad-network pixels fire.
    track("conversion", { page: "thank_you" });
  }, []);

  const t = funnel.thankYou;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <section className="mx-auto flex w-full max-w-page flex-1 items-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 13l4 4L19 7"
                stroke="#0A2E36"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {t.heading}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-body">{t.sub}</p>

          <div className="mx-auto mt-8 max-w-xl text-left">
            <VideoFrame youtube={t.videoYouTubeId} title={t.videoTitle} eventPrefix="thankyou" />
          </div>

          <a
            href={t.watchHref}
            onClick={() => track("cta_click", { page: "thank_you" })}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-accent-600"
          >
            {t.watchCta} <span aria-hidden>↗</span>
          </a>

          <p className="mt-6 font-mono text-xs text-muted">{t.inlineNote}</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

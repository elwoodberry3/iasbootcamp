"use client";

import { useEffect } from "react";
import { funnel } from "@/lib/funnel.config";
import { track } from "@/lib/track";
import { VideoFrame } from "@/components/VideoFrame";
import { TodoChip } from "@/components/TodoChip";
import { SiteFooter } from "@/components/SiteFooter";

export default function WatchPage() {
  useEffect(() => {
    track("page_view", { page: "watch" });
  }, []);

  const w = funnel.watch;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <p className="eyebrow mb-3">{funnel.brand.product}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
          {w.heading}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-body">{w.sub}</p>

        <div className="mt-8">
          <VideoFrame todoLabel={w.videoTodo.label} />
        </div>

        <div className="mt-8 rounded-xl border border-hair bg-ash p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-secondary">
            {w.assetLabel}
          </p>
          <p className="mt-2 text-sm text-body">{w.assetNote}</p>
          <div className="mt-4">
            <TodoChip label={w.assetTodo.label} />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

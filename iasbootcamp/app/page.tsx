"use client";

import { useEffect, useState } from "react";
import { funnel } from "@/lib/funnel.config";
import { track } from "@/lib/track";
import { VideoFrame } from "@/components/VideoFrame";
import { SignalRail } from "@/components/SignalRail";
import { LeadForm } from "@/components/LeadForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function VslPage() {
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    track("page_view", { page: "vsl" });
  }, []);

  const scrollToForm = () => {
    track("cta_click");
    document.getElementById("get")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <SiteHeader />

      {/* HERO + VSL */}
      <section className="mx-auto max-w-page px-6 pt-14 pb-10 sm:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-risein">
            <p className="eyebrow mb-4">{funnel.hero.eyebrow}</p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl">
              {funnel.hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">
              {funnel.hero.sub}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={scrollToForm}
                className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-accent-600"
              >
                {funnel.hero.ctaPrimary}
              </button>
              <span className="font-mono text-xs text-muted">{funnel.hero.ctaNote}</span>
            </div>
          </div>

          <div className="animate-risein">
            <VideoFrame
              youtube={funnel.hero.videoYouTubeId}
              title={funnel.hero.videoTitle}
              onCtaReady={() => setCtaReady(true)}
            />
          </div>
        </div>
      </section>

      {/* THE TRAP */}
      <section className="border-y border-hair bg-ash">
        <div className="mx-auto max-w-page px-6 py-14">
          <p className="eyebrow mb-6">{funnel.problem.label}</p>
          <div className="max-w-3xl space-y-5">
            {funnel.problem.lines.map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed ${
                  i === funnel.problem.lines.length - 1
                    ? "text-xl font-medium text-primary"
                    : "text-lg text-body"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="mx-auto max-w-page px-6 py-16">
        <p className="eyebrow mb-8">{funnel.outcomes.label}</p>
        <div className="grid gap-6 md:grid-cols-3">
          {funnel.outcomes.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-hair bg-white p-6">
              <span className="font-mono text-xs text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                {item.k}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER + SIGNAL RAIL */}
      <section className="border-y border-hair bg-ash">
        <div className="mx-auto grid max-w-page gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow mb-6">{funnel.founder.label}</p>
            <h2 className="font-display text-2xl font-semibold text-primary">
              {funnel.founder.name}
            </h2>
            <p className="mt-1 font-mono text-sm text-secondary">{funnel.founder.role}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">
              {funnel.founder.body}
            </p>
            <a
              href={funnel.brand.youtube}
              className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-bold text-primary hover:text-accent-600"
            >
              {funnel.founder.proofLabel} <span aria-hidden>↗</span>
            </a>
          </div>
          <SignalRail label={funnel.signals.label} items={funnel.signals.items} />
        </div>
      </section>

      {/* AGENDA */}
      <section className="mx-auto max-w-page px-6 py-16">
        <p className="eyebrow mb-8">{funnel.agenda.label}</p>
        <ol className="max-w-3xl space-y-4">
          {funnel.agenda.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="text-lg leading-relaxed text-body">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* LEAD CAPTURE */}
      <section id="get" className="border-t border-hair bg-primary">
        <div className="mx-auto max-w-page px-6 py-16">
          <div className="mx-auto max-w-xl">
            <LeadForm />
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Sticky CTA — appears after 75% watched (or is always available on scroll). */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-white/95 backdrop-blur transition-transform duration-300 ${
          ctaReady ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-6 py-3">
          <span className="hidden font-mono text-xs text-muted sm:block">
            You've seen enough. Grab the training.
          </span>
          <button
            onClick={scrollToForm}
            className="ml-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent-600"
          >
            {funnel.hero.ctaPrimary}
          </button>
        </div>
      </div>
    </main>
  );
}

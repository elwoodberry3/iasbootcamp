import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TodoChip } from "@/components/TodoChip";
import { funnel, about } from "@/lib/funnel.config";

export const metadata: Metadata = {
  title: "About — The IAS Bootcamp",
  description:
    "What the IAS Bootcamp is, who it's for, and the story behind it — from I Automate Shit.",
};

/**
 * About page.
 *
 * Structure follows the PBS documentary pitch ("The Prompt Divide: Coding the
 * Future"). Governance (Article IX): copy that must be lifted verbatim from the
 * pitch document is rendered as a visible TodoChip, NOT fabricated. Fill each
 * section's real prose in about.* in funnel.config.ts and the chip disappears.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-page px-6 pt-14 pb-10 sm:pt-20">
        <p className="eyebrow mb-4">{about.eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl">
          {about.heading}
        </h1>
        {about.sub ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {about.sub}
          </p>
        ) : (
          <div className="mt-6">
            <TodoChip label="about.sub — pitch logline (pitch__the-prompt-divide-coding-the-future.md)" />
          </div>
        )}
      </section>

      {/* The Prompt Divide — the thesis */}
      <section className="border-y border-hair bg-ash">
        <div className="mx-auto max-w-page px-6 py-14">
          <p className="eyebrow mb-6">{about.thesis.label}</p>
          <div className="max-w-3xl space-y-5">
            {about.thesis.lines.length ? (
              about.thesis.lines.map((line, i) => (
                <p key={i} className="text-lg leading-relaxed text-body">
                  {line}
                </p>
              ))
            ) : (
              <TodoChip label="about.thesis.lines — 'The Prompt Divide' thesis from the pitch" />
            )}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-page px-6 py-16">
        <p className="eyebrow mb-8">{about.who.label}</p>
        <div className="grid gap-6 md:grid-cols-2">
          {about.who.items.map((item, i) => (
            <div key={i} className="border border-hair bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-primary">
                {item.k}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The program */}
      <section className="border-y border-hair bg-ash">
        <div className="mx-auto max-w-page px-6 py-16">
          <p className="eyebrow mb-6">{about.program.label}</p>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl space-y-5">
              {about.program.lines.length ? (
                about.program.lines.map((line, i) => (
                  <p key={i} className="text-lg leading-relaxed text-body">
                    {line}
                  </p>
                ))
              ) : (
                <TodoChip label="about.program.lines — what the bootcamp actually is" />
              )}
            </div>
            <ol className="space-y-4">
              {about.program.pillars.map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-base leading-relaxed text-body">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Who's behind it */}
      <section className="mx-auto max-w-page px-6 py-16">
        <p className="eyebrow mb-6">{about.founder.label}</p>
        <h2 className="font-display text-2xl font-semibold text-primary">
          {about.founder.name}
        </h2>
        <p className="mt-1 font-mono text-sm text-secondary">
          {about.founder.role}
        </p>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
          {about.founder.body}
        </p>
        <a
          href={funnel.brand.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-bold text-primary hover:text-accent-600"
        >
          {about.founder.proofLabel} <span aria-hidden>↗</span>
        </a>
      </section>

      {/* CTA back into the funnel */}
      <section className="border-t border-hair bg-primary">
        <div className="mx-auto max-w-page px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">
            {about.cta.heading}
          </h2>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-accent-600"
          >
            {about.cta.button}
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

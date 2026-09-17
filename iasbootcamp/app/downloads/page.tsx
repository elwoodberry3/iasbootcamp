/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { downloadsPage, downloads } from "@/lib/downloads.config";

export const metadata: Metadata = {
  title: "Downloads — The IAS Bootcamp",
  description:
    "Free, IAS-branded cheatsheets for agentic developers — reference cards built from real Claude Code work. From I Automate Shit.",
};

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO — matches the /tools + homepage hero rhythm */}
      <section className="mx-auto max-w-page px-6 pt-14 pb-6 sm:pt-20">
        <p className="eyebrow mb-4">{downloadsPage.eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl">
          {downloadsPage.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{downloadsPage.sub}</p>
      </section>

      {/* GRID — "Recommended for you" (wireframe 1). Config-driven; scales to ∞. */}
      <section className="mx-auto max-w-page px-6 pb-20">
        <p className="mb-6 font-display text-lg font-semibold text-primary">
          {downloadsPage.recommendedLabel}
        </p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {downloads.map((d) => (
            <li
              key={d.slug}
              className="flex flex-col overflow-hidden border border-hair bg-white transition hover:border-secondary-200"
            >
              <Link href={`/downloads/${d.slug}`} className="flex flex-1 flex-col">
                {/* 16:9 illustration */}
                <div className="aspect-video w-full overflow-hidden border-b border-hair bg-ash">
                  <img
                    src={d.image}
                    alt={`${d.title} cheatsheet illustration`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    {d.status === "live" ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
                        <span className="block h-2 w-2 rounded-full bg-accent animate-signal" />
                        Live
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        Soon
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-primary">
                    {d.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-body">{d.summary}</p>
                  <p className="mt-auto pt-4 font-mono text-[11px] text-muted">{d.build}</p>
                </div>
              </Link>

              <div className="border-t border-hair p-4">
                <Link
                  href={`/downloads/${d.slug}`}
                  className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-accent-600"
                >
                  {d.status === "live" ? "Get the PDF" : "Preview"} <span aria-hidden>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}

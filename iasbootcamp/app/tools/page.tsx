/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toolsPage, tools } from "@/lib/tools.config";

export const metadata: Metadata = {
  title: "Tools — The IAS Bootcamp",
  description:
    "Free web tools for agentic developers, built by I Automate Shit. Each runs independently of the bootcamp.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="mx-auto max-w-page px-6 pt-14 pb-6 sm:pt-20">
        <p className="eyebrow mb-4">{toolsPage.eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl">
          {toolsPage.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
          {toolsPage.sub}
        </p>
      </section>

      <section className="mx-auto max-w-page px-6 pb-20">
        <ul className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool.title} className="flex flex-col overflow-hidden border border-hair bg-white transition hover:border-secondary-200">
              <div className="flex gap-5 p-6">
                {/* 1:1 tool image */}
                {/* <div className="h-20 w-20 shrink-0 overflow-hidden border border-hair bg-ash"> */}
                <div className="h-20 w-20 shrink-0 overflow-hidden">
                  <img src={tool.image} alt={`${tool.title} icon`} className="h-full w-full object-cover" width={80} height={80}/>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-primary">
                      {tool.title}
                    </h2>
                    {tool.status === "live" ? (
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
                  <p className="mt-0.5 font-mono text-xs text-secondary">
                    {tool.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {tool.description}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-muted">
                    {tool.build}
                  </p>
                </div>
              </div>

              <div className="mt-auto border-t border-hair p-4">
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-accent-600"
                >
                  Open {tool.title} <span aria-hidden>↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}

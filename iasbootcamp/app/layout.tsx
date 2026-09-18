/**
 * LAYOUT — IAS Bootcamp  ·  canonical shell, route-group host
 *
 * The root owns <html>/<body>, fonts, globals.css, and the skip-link. Chrome is
 * composed one level down so funnel and browsable routes can differ WITHOUT the
 * root layout knowing about either:
 *   app/(site)/layout.tsx   → header + footer   (about, downloads, legal, tools)
 *   app/(funnel)/layout.tsx → footer only        (thank-you, watch, optionally landing)
 * Route groups do not change URLs. The #main landmark lives in the group layouts so
 * SiteHeader/SiteFooter render OUTSIDE <main>; the skip-link here targets it.
 *
 * Base bg/color/font come from app/globals.css (@layer base) — not repeated on <body>.
 */

import type { Metadata } from "next";

import { Space_Grotesk, Space_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-grotesk",});
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-mono",});
const body = Inter({subsets: ["latin"],variable: "--font-body",display: "swap",}); // Body face = Inter, bound to the canonical --font-body var the preset reads.

export const metadata: Metadata = {
  title: "The IAS Bootcamp — Become the one AI can't replace",
  description: "Free training: how to use AI and automation to become more valuable at work — no coding degree, no hype, just builds. From I Automate Shit.",
  openGraph: {
    title: "The IAS Bootcamp — Become the one AI can't replace",
    description: "Free, no-fluff training on using AI and automation to level up your career. Just builds.",
    type: "website",
  },
  robots: { index: true, follow: true },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">   {/* bg/color/font come from globals.css @layer base — don't repeat them here */}
        
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
          Skip to Content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        
      </body>
    </html>
  );
}

/*
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
*/
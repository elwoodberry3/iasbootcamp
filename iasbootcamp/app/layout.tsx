/**
 * LAYOUT — IAS Bootcamp  ·  chrome-at-root variant
 *
 * Root owns <html>/<body>, fonts, globals.css, skip-link, AND global chrome
 * (SiteHeader/SiteFooter). Every route gets the header + footer.
 *
 * If you switch to the route-group split later, strip SiteHeader/<main>/SiteFooter
 * from here (leave {children}) and put them in app/(site)/layout.tsx — do NOT keep
 * chrome in both places or it renders twice.
 *
 * Base bg/color/font come from app/globals.css (@layer base) — not repeated on <body>.
 * All three fonts resolve from node_modules/next after `npm install`.
 */

import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-grotesk",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});
// Body face = Inter, bound to the canonical --font-body var the preset reads.
const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "The IAS Bootcamp — Become the one AI can't replace",
  description:
    "Free training: how to use AI and automation to become more valuable at work — no coding degree, no hype, just builds. From I Automate Shit.",
  openGraph: {
    title: "The IAS Bootcamp — Become the one AI can't replace",
    description:
      "Free, no-fluff training on using AI and automation to level up your career. Just builds.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

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
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

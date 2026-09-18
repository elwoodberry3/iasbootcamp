/**
 * LAYOUT — IAS Bootcamp · (funnel) group
 *
 * Conversion routes: footer only, no header. The footer keeps legal links (trust /
 * compliance); the header nav is removed to cut exit paths on funnel pages. This
 * matches how thank-you / watch already behave (footer-only).
 *
 * Routes: thank-you, watch (and the landing page.tsx IF you choose to strip its
 * header — see README, "The landing decision"). To make a route fully bare, remove
 * <SiteFooter/> below or give that page its own group.
 */

import { SiteFooter } from "@/components/SiteFooter";

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * LAYOUT — IAS Bootcamp · (site) group
 *
 * Full chrome for browsable routes: about, downloads, legal, tools.
 * Renders as a fragment so SiteHeader / <main> / SiteFooter become direct flex
 * children of <body> (set to `flex min-h-screen flex-col` in the root layout),
 * which gives a sticky footer via `flex-1` on <main>.
 *
 * Route groups do NOT affect URLs — app/(site)/about → /about.
 */

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

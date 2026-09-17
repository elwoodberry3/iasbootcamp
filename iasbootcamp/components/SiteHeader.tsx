import Link from "next/link";
import { funnel } from "@/lib/funnel.config";
import { BrandLogo } from "@/components/BrandLogo";

/**
 * SiteHeader — shared top bar across the site.
 *
 * Replaces the inline <header> that used to live in app/page.tsx. Nav is driven
 * from funnel.nav so the link set is config, not markup. Per the UI update:
 * nav is "Tools" + "About" only — no social links in the header (social lives
 * in the footer now).
 *
 * The logo links home; it carries the aria-label so BrandLogo is decorative to
 * avoid a double announce.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-hair">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label={`${funnel.brand.name} home`}
          className="inline-flex items-center"
        >
          <BrandLogo variant="onLight" decorative className="h-7 w-auto" />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6">
          {funnel.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

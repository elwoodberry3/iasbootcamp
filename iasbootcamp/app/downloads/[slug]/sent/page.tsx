import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { downloads, getDownload } from "@/lib/downloads.config";

export const metadata: Metadata = {
  title: "Check your email — IAS Downloads",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return downloads.map((d) => ({ slug: d.slug }));
}

export default async function DownloadSentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDownload(slug);
  if (!d) notFound();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <section className="mx-auto flex w-full max-w-page flex-1 items-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 13l4 4L19 7"
                stroke="#0A2E36"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Check your email.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-body">
            The download link for <span className="font-semibold text-primary">{d.title}</span> is on
            its way to your inbox. The link is good for 24 hours.
          </p>
          <p className="mt-6 font-mono text-xs text-muted">
            Didn&apos;t get it in a couple minutes? Check spam or the promotions tab.
          </p>
          <Link
            href="/downloads"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-hair px-6 py-3.5 text-sm font-semibold text-body transition hover:bg-ash"
          >
            ← Back to downloads
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

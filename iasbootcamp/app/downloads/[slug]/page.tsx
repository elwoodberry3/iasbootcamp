/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DownloadForm } from "@/components/DownloadForm";
import { downloads, getDownload } from "@/lib/downloads.config";

/** Pre-render one static page per configured download. */
export function generateStaticParams() {
  return downloads.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDownload(slug);
  if (!d) return { title: "Download not found — The IAS Bootcamp" };
  return {
    title: `${d.title} — IAS Downloads`,
    description: d.summary,
    openGraph: { title: d.title, description: d.summary, type: "article" },
  };
}

export default async function DownloadLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDownload(slug);
  if (!d) notFound();

  const isLive = d.status === "live";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* SPLIT HERO — copy + gated form on the left, illustration on the right */}
      <section className="mx-auto max-w-page px-6 pt-14 pb-16 sm:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-risein">
            <p className="eyebrow mb-4">Download</p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl">
              {d.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">{d.description}</p>

            <div className="mt-8 max-w-md">
              <DownloadForm slug={d.slug} disabled={!isLive} />
            </div>

            <p className="mt-6 font-mono text-[11px] text-muted">{d.build}</p>
          </div>

          <div className="animate-risein">
            <div className="overflow-hidden border border-hair bg-ash">
              <img
                src={d.image}
                alt={`${d.title} cheatsheet preview`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

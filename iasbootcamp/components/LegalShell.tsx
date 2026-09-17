import Link from "next/link";
import { SiteFooter } from "./SiteFooter";
import { TodoChip } from "./TodoChip";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link href="/" className="font-mono text-xs text-muted hover:text-primary">
          ← Back
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        <div className="mt-4">
          <TodoChip label="Placeholder text — replace with counsel-reviewed copy before running paid traffic" />
        </div>
        <div className="prose prose-sm mt-8 max-w-none text-body [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-primary [&_p]:mt-3 [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

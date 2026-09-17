"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

/**
 * DownloadForm — single-field (email) capture for a cheatsheet, matching the
 * wireframe: Email* input, full-width DOWNLOAD button, consent line under it.
 *
 * Posts to /api/download with the download slug. On success it routes to
 * /downloads/<slug>/sent (a lightweight confirmation), mirroring how the main
 * funnel routes to /thank-you. The email carries the signed, expiring link — we
 * never expose the file directly here (that's the whole point of the pattern).
 *
 * When `disabled` (a "soon" download), the form renders as an honest
 * coming-soon state instead of capturing a lead for a file we can't deliver.
 */
export function DownloadForm({
  slug,
  disabled = false,
}: {
  slug: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (disabled) {
    return (
      <div className="border border-hair bg-ash p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Coming soon</p>
        <p className="mt-2 text-sm leading-relaxed text-body">
          This cheatsheet isn&apos;t published yet. It&apos;s on the list — check back shortly, or
          grab one that&apos;s live from the{" "}
          <a href="/downloads" className="font-semibold text-primary underline hover:text-accent-600">
            downloads page
          </a>
          .
        </p>
      </div>
    );
  }

  const submit = async () => {
    if (!email.trim() || !email.includes("@")) {
      return setError("That email doesn't look right.");
    }
    setError(null);
    setBusy(true);
    track("download", { slug });
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), slug }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      track("conversion", { page: "download", slug, email_domain: email.split("@")[1] });
      router.push(`/downloads/${slug}/sent`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  };

  return (
    <div>
      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
        Email <span className="text-accent-600">*</span>
      </label>
      <input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        className="w-full rounded-lg border border-hair bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled focus:border-accent"
      />

      <button
        onClick={submit}
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-accent px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-accent-600 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Download"}
      </button>

      {error ? (
        <p className="mt-4 rounded-lg bg-secondary-50 px-3 py-2 font-mono text-xs text-secondary-700">
          {error}
        </p>
      ) : null}

      <p className="mt-4 text-center text-xs leading-relaxed text-muted">
        By continuing you agree to get emails from IAS about the training and future builds.
        Unsubscribe anytime.
      </p>
    </div>
  );
}

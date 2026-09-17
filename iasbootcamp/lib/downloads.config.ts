/**
 * downloads.config.ts — single source of truth for the /downloads feature.
 *
 * Governance (Article VIII / config-as-data, mirrors tools.config.ts):
 * - Adding a download = ONE entry in `downloads`, nothing else. The index grid,
 *   the per-slug landing page, and the delivery route all read from here, so the
 *   feature scales to unlimited downloads without new files or markup.
 * - "Demonstrate, never claim." (Article VI/IX) Titles/descriptions below are
 *   drafted from the actual source CSVs (Onboarding, Actions, Models, Modes) —
 *   they describe what each PDF genuinely contains. `status: "live"` (the
 *   Kinetic-Emerald live-dot) is reserved for downloads whose PDF is actually
 *   published in the repo and reachable. A download whose PDF is not yet in the
 *   repo stays `status: "soon"` and does NOT get the emerald treatment.
 *
 * Delivery model (Article VIII / reuse): IAS "link, don't attach" pattern,
 * identical to AgentForge/BrandForge. On email submit, /api/download fetches the
 * static PDF from the iasbootcamp/iasdownloads repo, stashes the bytes behind a
 * signed, expiring /d/<token> link on our OWN domain (signedLink.ts), and emails
 * that link. An attachment from a young domain is a Gmail spam signal; a link on
 * our verified domain is a trust signal.
 *
 * Field contract (enforced by the Download type + dev guard below):
 *   slug        — URL segment: /downloads/<slug>. Lowercase, hyphenated, stable.
 *   title       — the download's public name (drafted from source CSV).
 *   pdfName     — filename the LEAD receives, e.g. "ias-agentic-maturity-ladder.pdf".
 *   summary     — hard cap 90 chars. One line, shown on the index card.
 *   description — longer copy for the single landing page (the wireframe hero sub).
 *   image       — 16:9 illustration in /public/pngs/downloads/ (index + hero).
 *   build       — IAS numbered-portfolio reference (proof, not marketing).
 *   repoPath    — path to the PDF inside the iasbootcamp/iasdownloads repo.
 *   status      — "live" | "soon". Drives the emerald live-dot AND whether the
 *                 form is enabled. "soon" = PDF not yet published; form is gated
 *                 off with an honest "coming soon" note instead of 404-ing a lead.
 */

export type DownloadStatus = "live" | "soon";

export type Download = {
  slug: string;
  title: string;
  pdfName: string;
  /** Hard cap: 90 characters. Validated at module load in dev. */
  summary: string;
  description: string;
  image: string;
  build: string;
  repoPath: string;
  status: DownloadStatus;
};

/**
 * PDF source repo. PDFs ALWAYS live in a separate repo from the site build
 * (confirmed: site is elwoodberry3/*, PDFs are iasbootcamp/iasdownloads).
 * Convention established here: PDFs live under `pdfs/<slug>.pdf` on `main`,
 * served via raw.githubusercontent.com. /api/download builds the raw URL from
 * DOWNLOADS_REPO + repoPath, so re-pointing the repo/branch is a one-line change.
 */
export const DOWNLOADS_REPO = {
  owner: "iasbootcamp",
  name: "iasdownloads",
  branch: "main",
} as const;

/** Absolute raw URL for a download's PDF in the source repo. */
export function rawPdfUrl(d: Pick<Download, "repoPath">): string {
  const { owner, name, branch } = DOWNLOADS_REPO;
  return `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${d.repoPath}`;
}

export const downloadsPage = {
  eyebrow: "Downloads",
  heading: "Free, IAS-branded cheatsheets for agentic developers",
  sub: "Reference cards I built from real Claude Code work — the same tables I keep open while I build. Each one is a preformatted PDF. Drop your email and I'll send you the link.",
  recommendedLabel: "Recommended for you",
} as const;

/**
 * The four launch cheatsheets. Titles + copy are drafted honestly from the
 * source CSVs — each PDF's final layout is TBD, so every entry ships as
 * `status: "soon"` until its PDF is published at `pdfs/<slug>.pdf` in the repo.
 * Flip an entry to "live" ONLY once its PDF is actually reachable there.
 */
export const downloads: Download[] = [
  {
    slug: "agentic-maturity-ladder",
    title: "The Agentic Maturity Ladder",
    pdfName: "ias-agentic-maturity-ladder.pdf",
    summary: "Five levels from prompting to agentic planning — and the best practice at each rung.",
    description:
      "The onboarding map for Claude Code. Five levels — Prompting, Context, Governance, Autonomy, Agentic Planning — each with what it teaches, an example developer prompt, and the best practice that keeps you honest as you climb. Built to answer one question: what should I actually learn next?",
    image: "/pngs/downloads/agentic-maturity-ladder.png",
    build: "Build 023 — Cheatsheet 00: Onboarding",
    repoPath: "pdfs/agentic-maturity-ladder.pdf",
    status: "live",
  },
  {
    slug: "claude-code-control-panel",
    title: "The Claude Code Control Panel",
    pdfName: "ias-claude-code-control-panel.pdf",
    summary: "Every Context, Model, Customize & Settings action — what it does and when to reach for it.",
    description:
      "The full control surface of Claude Code in one reference: Attach File, Mention Project File, Clear, Rewind, Switch Model, Effort, Memory, MCP Servers, Hooks, Permissions, Slash Commands, and the rest. Each action gets a plain-English description, its scope/persistence, and a real developer tip — so you stop guessing which control does what.",
    image: "/pngs/downloads/claude-code-control-panel.png",
    build: "Build 024 — Cheatsheet 01: Actions",
    repoPath: "pdfs/claude-code-control-panel.pdf",
    status: "live",
  },
  {
    slug: "which-claude-model-when",
    title: "Which Claude Model, When",
    pdfName: "ias-which-claude-model-when.pdf",
    summary: "Sonnet, Opus, Fable & Haiku matched to the job — plus how Effort and Thinking fit in.",
    description:
      "Stop paying your principal engineer to rename files. This card maps each model — Default, Sonnet 5, Opus 5, Fable 5.1, Haiku 4.5 — to its best use, agentic role, and relative speed/compute, then separates model choice from Effort and Thinking so you escalate capability only when the task actually earns it.",
    image: "/pngs/downloads/which-claude-model-when.png",
    build: "Build 025 — Cheatsheet 02: Models",
    repoPath: "pdfs/which-claude-model-when.pdf",
    status: "live",
  },
  {
    slug: "permission-modes-and-autonomy",
    title: "Permission Modes & Autonomy",
    pdfName: "ias-permission-modes-and-autonomy.pdf",
    summary: "Manual → Edit → Plan → Auto: who approves what, and why Effort isn't autonomy.",
    description:
      "The four permission modes side by side — Manual, Edit Automatically, Plan, Auto — showing what each can inspect and edit, its approval behavior, and its best use. The card that makes the one distinction most people miss: Effort makes Claude reason harder; Auto decides what it may execute without stopping. They are not the same dial.",
    image: "/pngs/downloads/permission-modes-and-autonomy.png",
    build: "Build 026 — Cheatsheet 04: Modes",
    repoPath: "pdfs/permission-modes-and-autonomy.pdf",
    status: "live",
  },
];

/** Lookup by slug — used by the [slug] landing page and /api/download. */
export function getDownload(slug: string): Download | undefined {
  return downloads.find((d) => d.slug === slug);
}

/**
 * Dev-only guards: keep the config contracts honest without ever taking the
 * page down in production (mirrors the tools.config.ts pattern). Warns on
 * over-long summaries and duplicate slugs.
 */
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const d of downloads) {
    if (d.summary.length > 90) {
      // eslint-disable-next-line no-console
      console.warn(
        `[downloads.config] "${d.title}" summary is ${d.summary.length} chars (max 90): "${d.summary}"`
      );
    }
    if (seen.has(d.slug)) {
      // eslint-disable-next-line no-console
      console.warn(`[downloads.config] duplicate slug: "${d.slug}"`);
    }
    seen.add(d.slug);
  }
}

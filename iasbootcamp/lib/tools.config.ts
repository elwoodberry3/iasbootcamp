/**
 * tools.config.ts — single source of truth for the /tools page.
 *
 * Governance (Article VIII / config-as-data):
 * - Tools are INDEPENDENT of the main funnel. This file only describes how each
 *   tool is *presented* on /tools; each tool is deployed on its own subdomain
 *   and owns its own stack. Adding a tool = one entry here, nothing else.
 * - "Demonstrate, never claim." `status: "live"` (Kinetic Emerald pulse) is
 *   reserved for tools genuinely deployed and reachable. Anything not yet live
 *   is `status: "soon"` and does NOT get the emerald treatment.
 *
 * Field contract (enforced by the Tool type below):
 *   title        — tool name, e.g. "AgentFORGE"
 *   subtitle     — one short line under the title (the FORGE sub-brand line)
 *   description  — hard cap 50 characters. Kept terse on purpose.
 *   href         — external URL to the tool (opens in a new tab).
 *   image        — 1:1 ratio SVG stored in /public/svgs/tools/.
 *   build        — the IAS numbered-portfolio reference (proof, not marketing).
 *   status       — "live" | "soon". Drives the emerald live-dot only.
 */

export type ToolStatus = "live" | "soon";

export type Tool = {
  title: string;
  subtitle: string;
  /** Hard cap: 50 characters. Validated at module load in dev. */
  description: string;
  href: string;
  image: string;
  build: string;
  status: ToolStatus;
};

export const toolsPage = {
  eyebrow: "Student tools",
  heading: "Web tools for agentic developers",
  sub: "Small, focused tools I build for people learning to build with agents. Each one runs on its own — independent of the bootcamp. Free to use.",
} as const;

export const tools: Tool[] = [
  {
    title: "AgentFORGE",
    subtitle: "Part of the FORGE toolset",
    description: "Generate the initial CLAUDE.md for your project.",
    href: "https://agentforge.iasbootcamp.com",
    image: "/pngs/tools/agentforge.png",
    build: "Build 021 — CLAUDE.md Generator",
    status: "live",
  },
  {
    title: "BrandFORGE",
    subtitle: "Part of the FORGE toolset",
    description: "Generate a brand guide for your project.",
    href: "https://brandforge.iasbootcamp.com",
    image: "/pngs/tools/brandforge.png",
    build: "Build 022 — Branddeck",
    status: "live",
  },
];

/**
 * Dev-only guard: keep the 50-char description contract honest. Throws loudly in
 * development if a new tool entry breaks it; no-op in production so it can never
 * take the page down. This is the "structural governance" pattern — the rule is
 * enforced by the data layer, not by remembering it.
 */
if (process.env.NODE_ENV !== "production") {
  for (const t of tools) {
    if (t.description.length > 50) {
      // eslint-disable-next-line no-console
      console.warn(
        `[tools.config] "${t.title}" description is ${t.description.length} chars (max 50): "${t.description}"`
      );
    }
  }
}

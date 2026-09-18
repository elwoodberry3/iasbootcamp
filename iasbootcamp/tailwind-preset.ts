import type { Config } from "tailwindcss";

/**
 * IAS shared Tailwind preset — the single source of truth for every IAS build.
 * Every value below is traced to ias_color_system.csv (section refs in comments).
 *
 * USAGE
 *   // tailwind.config.ts (each app)
 *   import iasPreset from "./tailwind-preset";      // drop-in copy, four separate repos
 *   export default { presets: [iasPreset], content: [...] };
 *   // Later, once the shared package exists: import iasPreset from "@ias/tailwind-preset";
 *
 * NON-BREAKING CONTRACT
 * - Canonical neutral names come from CSV §06 (functional aliases): dark, light,
 *   white, mid, muted. Legacy names still referenced in components (ink, ash, hair,
 *   border-gray, muted-gray, body-gray, disabled-gray) are kept as aliases pointing
 *   at the SAME hex. Delete the aliases only after components are migrated.
 * - Fonts resolve through CSS vars set per app in layout.tsx:
 *     --font-grotesk (display) · --font-mono (code) · --font-body (body copy)
 *   `body`/`sans` fall back to --font-grotesk when --font-body is unset, so an app
 *   that hasn't picked a body face yet renders Grotesk instead of a system font.
 * - This preset does NOT set `content`, `corePlugins`, or `preflight`. Those stay
 *   per-app so portfolio can keep preflight:false and bootcamp can keep its radius.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // §01 / §02 — Deep Slate Teal (primary — headers, nav, dark surfaces · 30%)
        primary: {
          DEFAULT: "#0A2E36", // §01 Deep Slate Teal
          50: "#E8F0F1",      // §02 Primary-50  — hover backgrounds, row fills
          100: "#C1D5D9",     // §02 Primary-100 — disabled-state fills
          400: "#4B7A8A",     // §02 Primary-400 — reversed text on dark, sub-labels
          800: "#062028",     // §02 Primary-800 — pressed states, overlays
          950: "#030F12",     // §02 Primary-950 — near-black, modal overlays
        },
        // §01 / §03 — Muted Seafoam (secondary — icons, dividers, accent on dark)
        secondary: {
          DEFAULT: "#3F7266", // §01 Muted Seafoam
          50: "#E6F0EE",      // §03 Secondary-50  — pill backgrounds, success fills
          200: "#9BBEC0",     // §03 Secondary-200 — reversed wordmark accent
          400: "#5C8A8C",     // §03 Secondary-400 — reversed mono text on dark
          700: "#2A5047",     // §03 Secondary-700 — hover on secondary elements
          900: "#1A3330",     // §03 Secondary-900 — deep secondary fills
        },
        // §01 / §04 — Kinetic Emerald (accent — CTAs, links, active/LIVE states ONLY · 10%)
        accent: {
          DEFAULT: "#00E5A3",            // §01 Kinetic Emerald
          600: "#00B882",                // §04 Accent-600 — pressed/hover CTA
          "04": "rgba(0,229,163,0.04)",  // §04 Accent-04  — selected card fill
          "05": "rgba(0,229,163,0.05)",  // §04 Accent-05  — dropzone hover
          "15": "rgba(0,229,163,0.15)",  // §04 Accent-15  — progress glow ring
          "30": "rgba(0,229,163,0.30)",  // §04 Accent-30  — icon stroke on dark
        },
        // §05 / §06 — Neutrals. Canonical functional names (CSV §06) first.
        white: "#FFFFFF",    // §06 --white — card fills, reversed type
        dark: "#111827",     // §06 --dark  (Ink Blue-Gray) — body type, borders
        light: "#F9FAFB",    // §06 --light (Pure Ash) — canvas, section fills · 60%
        mid: "#E5E7EB",      // §06 --mid   (Border Gray) — hairlines, input strokes
        muted: "#6B7280",    // §06 --muted (Muted Gray) — captions, eyebrows, metadata
        body: "#374151",     // §05 Body Gray — paragraph text
        disabled: "#9CA3AF", // §05 Disabled Gray — inactive buttons, placeholders

        // Legacy aliases (same hex) — DELETE after component migration.
        ink: "#111827",             // → dark
        ash: "#F9FAFB",             // → light
        hair: "#E5E7EB",            // → mid
        "border-gray": "#E5E7EB",   // → mid
        "muted-gray": "#6B7280",    // → muted
        "body-gray": "#374151",     // → body
        "disabled-gray": "#9CA3AF", // → disabled
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-body, var(--font-grotesk))", "system-ui", "sans-serif"],
        sans: ["var(--font-body, var(--font-grotesk))", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // § type scale — eyebrow / build-log label
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        page: "72rem",    // 1152px content column (canonical)
        content: "72rem", // legacy alias (portfolio) — remove after markup migration
      },
      borderRadius: {
        btn: "5px",      // button radius — single source of truth
        card: "0.75rem", // card radius
      },
      keyframes: {
        // canonical
        signal: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        risein: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // legacy aliases (portfolio) — remove after markup migration
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        signal: "signal 1.6s ease-in-out infinite",
        risein: "risein 0.6s ease-out both",
        "pulse-live": "pulse-live 1.6s ease-in-out infinite", // legacy alias of signal
        "fade-up": "fade-up 0.5s ease-out both",              // legacy alias of risein
      },
    },
  },
  plugins: [],
};

export default preset;

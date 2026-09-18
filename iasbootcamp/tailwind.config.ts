import type { Config } from "tailwindcss";
import iasPreset from "./tailwind-preset";

/**
 * IAS Bootcamp — extends the shared IAS preset.
 * KEEP the global corner-radius override: every rounded-* collapses to 0.25rem with
 * no markup changes. This is bootcamp's deliberate UI decision, app-specific for now.
 * Promote it into the preset only if 0.25rem becomes the house radius for all builds.
 * `rounded-none` (0) and `rounded-full` (9999px) intentionally keep Tailwind defaults.
 */
const config: Config = {
  presets: [iasPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.25rem",
        lg: "0.25rem",
        xl: "0.25rem",
        "2xl": "0.25rem",
        "3xl": "0.25rem",
      },
    },
  },
};

export default config;

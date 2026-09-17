import type { Config } from "tailwindcss";

/**
 * IAS brand tokens — sourced directly from ias_color_system.csv.
 * 60/30/10 rule: Ash/White canvas (60), Deep Slate Teal (30), Kinetic Emerald (10).
 * Emerald is reserved for genuinely live/active states (Article VI governance).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A2E36", // Deep Slate Teal
          50: "#E8F0F1",
          100: "#C1D5D9",
          400: "#4B7A8A",
          800: "#062028",
          950: "#030F12",
        },
        secondary: {
          DEFAULT: "#3F7266", // Muted Seafoam
          50: "#E6F0EE",
          200: "#9BBEC0",
          400: "#5C8A8C",
          700: "#2A5047",
          900: "#1A3330",
        },
        accent: {
          DEFAULT: "#00E5A3", // Kinetic Emerald — live/active only
          600: "#00B882",
        },
        ink: "#111827",      // Ink Blue-Gray
        ash: "#F9FAFB",      // Pure Ash
        body: "#374151",     // Body Gray
        muted: "#6B7280",    // Muted Gray
        hair: "#E5E7EB",     // Border Gray
        disabled: "#9CA3AF",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
      },
      /**
       * Site-wide corner radius = 0.25rem (UI update). Overriding the scale
       * here means every existing `rounded`, `rounded-lg`, `rounded-xl`, and
       * `rounded-2xl` collapses to 0.25rem with no markup changes — buttons,
       * the YouTube facade, cards, containers, inputs. `rounded-full` is left
       * intact for genuine circles (signal dots, step badges, avatars).
       */
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.25rem",
        lg: "0.25rem",
        xl: "0.25rem",
        "2xl": "0.25rem",
        "3xl": "0.25rem",
        // `none` (0) and `full` (9999px) intentionally keep Tailwind defaults.
      },
      keyframes: {
        signal: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        risein: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        signal: "signal 1.6s ease-in-out infinite",
        risein: "risein 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

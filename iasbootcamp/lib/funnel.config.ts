/**
 * funnel.config.ts — single source of truth for the VSL funnel.
 *
 * Governance notes (Article VI / IX):
 * - "Demonstrate, never claim." No fabricated metrics, no fake testimonials.
 * - Any number that isn't real is a TODO chip, not a made-up figure.
 * - Kinetic Emerald / "live" status reserved for things that are genuinely live.
 *
 * Voice: written for the target audience (Black men, 22–32, who know AI matters
 * but haven't found a way in that isn't "learn to code"). Direct, grounded,
 * no guru cadence. The authority is Steve building in public — not borrowed.
 */

export type Todo = { __todo: true; label: string };
export const todo = (label: string): Todo => ({ __todo: true, label });
export const isTodo = (v: unknown): v is Todo =>
  typeof v === "object" && v !== null && (v as Todo).__todo === true;

export const funnel = {
  brand: {
    name: "I Automate Shit",
    short: "IAS",
    product: "The IAS Bootcamp",
    founder: "Elwood “Steve” Berry",
    // Positioning north star — NOT shown on-page. Internal only.
    _northStar: "The Nate Herk for African American men.",
    youtube: "https://www.youtube.com/@iautomatesht",
  },

  // ── PRIMARY NAV ────────────────────────────────────────────────────────
  // Header link set. Tools + About only — no social in the header (social
  // lives in the footer). Config, not markup, so the set is edited here.
  nav: [
    { label: "Downloads", href: "/downloads" },
    { label: "Tools", href: "/tools" },
    { label: "About", href: "/about" },
  ],

  // ── SOCIAL (footer only) ───────────────────────────────────────────────
  // `key` maps to an inline SVG glyph in SiteFooter. All open in a new tab.
  social: [
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/ias-bootcamp" },
    { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@iautomatesht" },
    { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@iautomateshit" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/iautomatesht" },
    { key: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61593049247788" },
    { key: "x", label: "X", href: "https://x.com/iautomaterobots" },
    { key: "threads", label: "Threads", href: "https://www.threads.com/@iautomatesht" },
  ],

  // ── VSL HUB ────────────────────────────────────────────────────────────
  hero: {
    eyebrow: "Free training",
    // The promise. Speaks to the outcome (be the one who's valuable),
    // not the tech. AI is the vehicle, not the headline.
    headline: "You already know AI matters. Nobody showed you how to actually use it.",
    sub:
      "A free, no-fluff walkthrough of how I automate real work — and how you can become the man in your building nobody can replace. No coding degree. No hype. Just builds.",
    // The video is the VSL. Real, deployed YouTube VSL — rendered via the
    // enterprise lite-embed (facade, no third-party JS until click).
    videoYouTubeId: "SYa-fsWpftQ",
    videoTitle: "You already know AI matters — here's how to actually use it",
    ctaPrimary: "Watch the training",
    ctaNote: "Takes ~14 minutes. Then I hand you the workflow.",
  },

  // The audience's actual objection, named plainly.
  problem: {
    label: "The trap",
    lines: [
      "Everybody's talking about AI. Half of them are selling a course, the other half are telling you to learn Python.",
      "You don't want to become a software engineer. You want to be the one at work who ships faster, looks sharper, and gets moved up.",
      "That's a different skill. It's called building automations — and it's the most undervalued move in the room right now.",
    ],
  },

  // What they'll be able to do. Concrete, controllable, real.
  outcomes: {
    label: "What you'll be able to do",
    items: [
      {
        k: "Automate the boring part of your job",
        v: "Inbox, reports, follow-ups, data entry — the stuff that eats your day and makes you look slow.",
      },
      {
        k: "Build an “AI employee” that works while you sleep",
        v: "A workflow that reads, decides, and acts — using tools like n8n and Claude, no code required.",
      },
      {
        k: "Have proof, not just talk",
        v: "You walk away with a working build you made yourself. That's the résumé line and the raise conversation.",
      },
    ],
  },

  // The founder — this is where authority comes from. First person, earned.
  founder: {
    label: "Who's teaching this",
    name: "Steve Berry",
    role: "Automation engineer. Builds in public.",
    body:
      "I'm not a guru and I'm not going to sell you a dream. I build automation systems for a living and I put the work on camera — the wins and the parts that break. I'm doing this because when I was figuring it out, there wasn't anybody who looked like me showing the actual screen. So I'm the one.",
    proofLabel: "Watch the builds",
  },

  // What's inside the free training. Specific > clever.
  agenda: {
    label: "Inside the training",
    steps: [
      "The one automation every office worker should build first (and why it changes how people see you)",
      "The exact free/cheap stack I use — no enterprise budget required",
      "How to turn a boring task into a working “AI employee” in one sitting",
      "The path from your first build to getting paid for them",
    ],
  },

  // Live proof rail — the signature element. Only real things get the pulse.
  signals: {
    label: "What's actually live",
    items: [
      { on: true, text: "Weekly build session, every Saturday — no slides, just building" },
      { on: true, text: "Every training ends with a downloadable workflow you keep" },
      { on: false, text: todo("Community launch — opens after first cohort") },
    ],
  },

  // ── LEAD CAPTURE (multi-step) ──────────────────────────────────────────
  capture: {
    label: "Get the training",
    heading: "Where should I send it?",
    sub: "The video plus the workflow file from it. No spam — you can leave anytime.",
    steps: [
      {
        id: "identity",
        title: "Start here",
        fields: [
          { name: "firstName", label: "First name", type: "text", required: true, placeholder: "First name" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
        ],
      },
      {
        id: "context",
        title: "So I can tailor it",
        fields: [
          {
            name: "role",
            label: "What best describes you right now?",
            type: "select",
            required: true,
            options: [
              "Working a 9–5 (sales, ops, admin, marketing…)",
              "In school / just graduated",
              "Switching careers",
              "Running my own small business",
              "Something else",
            ],
          },
          {
            name: "goal",
            label: "What are you really after?",
            type: "select",
            required: false,
            options: [
              "A raise or a promotion",
              "A better job entirely",
              "Extra income on the side",
              "Just want to stop feeling behind on AI",
            ],
          },
        ],
      },
    ],
    submit: "Send me the training",
    submitting: "Sending…",
    consent:
      "By continuing you agree to get emails from IAS about the training and future builds. Unsubscribe anytime.",
  },

  // ── CONFIRMATION / SHOCK & AWE ─────────────────────────────────────────
  thankYou: {
    heading: "You're in. Check your email.",
    sub: "The training link is on its way to your inbox. While you wait — here's the room where I actually build.",
    // Shock & Awe: a real welcome/build video surfaced inline on confirmation,
    // rendered via the enterprise lite-embed. Real, deployed — not a placeholder.
    videoYouTubeId: "4W2LQrxhmMI",
    videoTitle: "Welcome to IAS — watch a build right now",
    watchCta: "Watch a build right now",
    watchHref: "https://www.youtube.com/@iautomatesht",
    inlineNote: "Didn't get the email in a couple minutes? Check spam, or the promotions tab.",
  },

  // ── VIDEO PAGE (gated content the email links to) ──────────────────────
  watch: {
    heading: "Your training",
    sub: "Watch it start to finish, then grab the workflow underneath. Build along with me.",
    videoTodo: todo("Embed gated training video (Mux signed URL / YouTube unlisted)"),
    assetLabel: "Today's workflow",
    assetNote: "The n8n workflow from this training. Import it and make it yours.",
    assetTodo: todo("Link the downloadable n8n workflow JSON"),
  },

  legal: {
    privacyHref: "/legal/privacy",
    termsHref: "/legal/terms",
    disclaimerHref: "/legal/disclaimer",
  },
} as const;

export type Funnel = typeof funnel;

/**
 * Build state model — future / live / past.
 *
 * There is no "class full" or waitlist concept. A build is either upcoming,
 * happening now, or already happened. The SITE always captures a real lead and
 * routes to /thank-you; WHICH email that lead receives (confirmation, live, or
 * VOD) is decided downstream by the "Build Bootcamp Email" n8n node, which reads
 * the stream calendar's state. The site does not need to know the state — it
 * just captures honestly and lets the calendar drive the message.
 *
 * Governance (Article IX): honest by construction. No scarcity theater, no
 * fake-full door. Every submit is a real capture into a real list.
 */

/**
 * about — content for /app/about.
 *
 * Source: the PBS documentary pitch "The Prompt Divide: Coding the Future"
 * (pitch__the-prompt-divide-coding-the-future.md). The pitch is written for a
 * broadcaster; the copy below adapts its thesis into landing-page voice —
 * grounded, first-person where it should be, no guru cadence. The pitch's
 * demographic framing (Black men) is kept because it's the actual positioning,
 * stated plainly rather than as a marketing hook.
 *
 * `who`, `program.pillars`, `founder`, and `cta` are grounded in things that
 * are already true elsewhere in this config, so they ship filled.
 */
export const about = {
  eyebrow: "About the program",

  heading: "AI is splitting the workforce in two. This is the side you want to be on.",

  sub: "Agentic AI just erased the old barrier to building software. For the first time, you can ship production-grade work without a CS degree — if you learn the tools before the window closes. That's what this is about.",

  // "The Prompt Divide" thesis — the documentary's core argument, in plain voice.
  thesis: {
    label: "The prompt divide",
    lines: [
      "Software used to take a degree and years of syntax. That's over. A single person using Claude Code can now orchestrate automation with n8n, stand up a full app on Next.js and Vercel, and style it with Tailwind — at a speed that didn't exist two years ago.",
      "That shift cuts both ways. The same automation wiping out entry-level tech, admin, and logistics roles is the thing you can learn to pilot. Black men are among the most exposed to the displacement — and the least likely to have been shown the door into the tools doing it.",
      "So this isn't a warning about AI. It's the blueprint. Learn to drive these tools and you stop being the one automated out — you become the one building the systems.",
    ],
  },

  who: {
    label: "Who this is for",
    items: [
      {
        k: "The 9–5'er who knows AI matters",
        v: "You're in sales, ops, admin, or marketing. You don't want to become a software engineer — you want to be the one who ships faster and gets moved up.",
      },
      {
        k: "The person who was never shown the door",
        v: "Everyone says \"learn AI.\" Nobody shows the actual screen. This is the screen — real builds, start to finish, nothing hand-waved.",
      },
    ],
  },

  program: {
    label: "What the bootcamp is",
    lines: [
      "The IAS Bootcamp is the accelerator version of that blueprint. Not theory, not a lecture on why AI matters — you already know it does. You learn the actual stack: Claude Code in the terminal to write and ship, n8n for the enterprise logic, Next.js and Vercel to deploy, Tailwind to make it look right.",
      "The goal is to move you from prompting novice to someone who orchestrates real systems — the person who architects the build, not the one racing the automation. Every session is a real build you keep, so what you walk away with is proof, not notes.",
    ],
    pillars: [
      "Free, no-fluff training built from real work — not slides.",
      "You leave every session with a working build you keep.",
      "Independent web tools you can use the moment you learn the concept.",
    ],
  },

  founder: {
    label: "Who's behind it",
    name: "Steve Berry",
    role: "Automation engineer. Builds in public.",
    body:
      "I build automation systems for a living and I put the work on camera — the wins and the parts that break. I'm doing this because when I was figuring it out, there wasn't anybody who looked like me showing the actual screen. So I'm the one.",
    proofLabel: "Watch the builds",
  },

  cta: {
    heading: "Ready to see how it actually works?",
    button: "Watch the free training",
  },
} as const;

export type About = typeof about;

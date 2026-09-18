# Repository Structures
The IAS ecosystem

## IAS Bootcamp Application Architecture  
A high-velocity learning and acquisition portal for Claude Code and agentic development that combines video education, live-build registration, technical resources, downloads, and conversion workflows in one experience.

```js
iasbootcamp/
└── app/                                               # Next.js App Router root — routes, API handlers, layout, global styles
    ├── about/                                         # About route — who Steve/IAS is, credibility and story for evaluating-fit visitors
        ├── page.tsx                                   # [ INSERT 100 CHARACTER PLAIN ENGLISH DESCRIPTION ]
    ├── api/                                           # Server-side route handlers that proxy to cloud-hosted n8n
        └── download/                                  # Download request endpoint group — mints signed, time-limited asset links
            ├── route.ts                               # Validates email, tags lead in n8n → HubSpot, returns signed Upstash download link via Resend
        └── lead/                                      # Lead capture endpoint group
            ├── route.ts                               # Validates email, stamps funnel_variant server-side, forwards lead to n8n → HubSpot + Resend
        └── track/                                     # Event tracking endpoint group
            ├── route.ts                               # Forwards VSL milestone + conversion events to n8n for timeline / retargeting / pixels
    ├── d/                                             # Short signed-download dispatch route — the link recipients actually click from email
        ├── [token]/                                   # Dynamic signed-token segment — one opaque token per issued download link
            ├── route.ts                               # Verifies the signed token + 24h TTL, streams the asset or 410s if the link is stale
    ├── downloads/                                     # Downloads hub — browsable Claude Code cheat sheets and technical resource assets
        ├── [slug]/                                    # Dynamic per-asset route — one page per downloadable resource by slug
            ├── [sent]/                                # Post-submit confirmation segment — shown after the email link has been dispatched
                ├── page.tsx                           # "Check your inbox" confirmation; the signed link was emailed, not exposed in-page
        ├── page.tsx                                   # Downloads index; lists available cheat sheets, each gated behind email capture
    ├── ics/                                           # Calendar route group — serves generated .ics files from stream-calendar.json
        ├── [id]/                                      # Dynamic stream-id segment — one calendar event per live-build stream id
            ├── route.ts                               # [ ADD route.ts HERE ] Reads stream-calendar.json, emits RFC 5545 .ics with VALARM
    ├── legal/                                         # Static legal pages rendered through the shared LegalShell wrapper
        ├── disclaimer/                                # Earnings / results disclaimer route
            ├── page.tsx                               # Earnings & results disclaimer content
        ├── privacy/                                   # Privacy policy route
            ├── page.tsx                               # Privacy policy content
        ├── terms/                                     # Terms & conditions route
            ├── page.tsx                               # Terms & conditions content
    ├── thank-you/                                     # Live-funnel conversion confirmation route
            ├── page.tsx                               # Confirmation page; fires conversion pixel + surfaces the inline welcome video (Shock & Awe)
    ├── tools/                                         # FORGE tool suite route — AgentForge / BrandForge enterprise-grade file generators
            ├── page.tsx                               # Tools hub; AgentForge (CLAUDE.md/SKILLS/MCP) + BrandForge, email-gated into tool_* capture
    ├── watch/                                         # Gated training-video route the delivery email links to
            ├── page.tsx                               # Hosts the gated training video + downloadable workflow asset (asset link still TODO)
    ├── layout.tsx                                     # Root layout: fonts (Space Grotesk/Mono, Inter), metadata, global chrome
    ├── page.tsx                                       # VSL landing page; hero YouTube VSL, mode-aware scarcity banner + CTA, lead capture
    ├── globals.css                                    # Tailwind base + brand utility classes (eyebrow, etc.)
└── data/                                              # Static data sources read by routes, pages, and the .ics generator
    ├── stream-calendar.json                           # Single source of truth for live-build streams; drives email, confirmation page + .ics
└── components/                                        # Reusable client components
    ├── LeadForm.tsx                                   # Multi-step capture; stamps funnel_variant, mode-aware copy, redirects via getSubmitRedirect()
    ├── LegalShell.tsx                                 # Shared layout wrapper for the legal pages
    ├── SignalRail.tsx                                 # "What's actually live" proof rail; pulse reserved for genuinely live items
    ├── SiteFooter.tsx                                 # Global footer with legal links + brand line
    ├── TodoChip.tsx                                   # Renders honest TODO markers for unresolved values instead of fabricating detail
    ├── VideoFrame.tsx                                 # Video wrapper: delegates to YouTubeEmbed for YT sources, native <video> otherwise, honest placeholder if neither
    ├── YouTubeEmbed.tsx                               # Enterprise lite-embed (facade): loads the YouTube iframe only on click; IFrame API milestone tracking
└── lib/                                               # Framework-agnostic config + helpers
    ├── downloadEmail.ts                               # Builds the download-delivery email (signed link, no attachment) sent via Resend
    ├── downloads.config.ts                            # Download asset registry — slug, title, file path, and metadata per cheat sheet
    ├── funnel.config.ts                               # Single source of truth for funnel copy, funnel-mode helpers, and class-full/waitlist copy
    ├── signedLink.ts                                  # Mints + verifies signed, 24h-TTL download tokens backed by Upstash
    ├── tools.config.ts                                # FORGE tool registry — AgentForge / BrandForge metadata, ias_source tags, copy
    ├── track.ts                                       # Client event helper + TrackEvent union (vsl_*, thankyou_*, waitlist_*, conversion)
└── public/                                            # Static assets served as-is at the site root
    └── pngs/                                          # Raster image assets (PNG)
        └── downloads/                                 # Preview thumbnails for the downloadable cheat sheet assets
            ├── agentic-maturity-ladder.png            # Cheat sheet preview — agentic maturity ladder
            ├── claude-code-control-panel.png          # Cheat sheet preview — Claude Code control panel
            ├── permission-modes-and-autonomy.png      # Cheat sheet preview — permission modes and autonomy
            ├── which-claude-model-when.png            # Cheat sheet preview — which Claude model to use when
        └── tools/                                     # Product imagery for the FORGE tool suite
            ├── agentforge.png                         # FORGE tool image — AgentForge (CLAUDE.md / SKILLS / MCP generator)
            ├── brandforge.png                         # FORGE tool image — BrandForge (brand-guide generator)
    └── svgs/                                          # Vector logo assets (SVG)
        ├── dark.mode__stacked.svg                     # Stacked IAS wordmark logo — dark-mode variant
        ├── light.mode__stacked.svg                    # Stacked IAS wordmark logo — light-mode variant
└── styles/                                            # [ INSERT 100 CHARACTER PLAIN ENGLISH DESCRIPTION ]
    ├── globals.css
├── next-env.d.ts                                      # Next.js TypeScript ambient types (generated)
├── next.config.mjs                                    # Next config; no static export (server API routes proxy to n8n) + /ics/:id.ics rewrite
├── package.json                                       # Dependencies + scripts (dev / build / start / lint)
├── postcss.config.mjs                                 # PostCSS pipeline for Tailwind + autoprefixer
├── preview.html                                       # Standalone static preview of the funnel layout
├── tailwind.config.ts                                 # Brand design tokens: Deep Slate Teal, Kinetic Emerald (live only), type scale
├── tsconfig.json                                      # TypeScript compiler config + path aliases (@/*)
├── .env.example                                       # Documents FUNNEL_MODE + n8n webhook envs; copy to .env.local to run
├── .gitignore                                         # Ignored paths (node_modules, .next, .env*, build artifacts)
└── README.md                                          # Project documentation
```

/**
 * Client-side event helper. Posts funnel + VSL milestone events to /api/track,
 * which forwards to n8n (and, from there, to HubSpot / ad pixels).
 *
 * VSL Milestone Trackers (from landing-page.md §2): 25 / 50 / 75 / CTA-shown / CTA-click.
 * These build retargeting audiences based on how much of the pitch was watched.
 */
export type TrackEvent =
  | "page_view"
  | "vsl_play"
  | "vsl_25"
  | "vsl_50"
  | "vsl_75"
  | "vsl_complete"
  | "thankyou_play"
  | "thankyou_25"
  | "thankyou_50"
  | "thankyou_75"
  | "thankyou_complete"
  | "cta_shown"
  | "cta_click"
  | "lead_step_2"
  | "lead_submit"
  | "download"
  | "conversion";

export async function track(event: TrackEvent, meta: Record<string, unknown> = {}) {
  try {
    // Fire-and-forget; never block UI on analytics.
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event,
        meta,
        ts: new Date().toISOString(),
        path: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });
  } catch {
    // Analytics must never break the funnel. Swallow.
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * Event tracking endpoint. Forwards VSL milestone + conversion events to n8n,
 * which fans them out to HubSpot timeline / retargeting audiences / ad pixels.
 *
 * Set N8N_TRACK_WEBHOOK_URL in Vercel env. Unset → log-only (dev/demo safe).
 */
export async function POST(req: NextRequest) {
  let event: Record<string, unknown>;
  try {
    event = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const webhook = process.env.N8N_TRACK_WEBHOOK_URL;
  if (!webhook) {
    console.log("[track]", event.event, event.meta ?? "");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch (err) {
    console.error("[track] webhook error:", err);
  }
  return NextResponse.json({ ok: true, forwarded: true });
}

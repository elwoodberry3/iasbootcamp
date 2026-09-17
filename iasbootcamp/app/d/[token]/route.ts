import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getDownload, rawPdfUrl } from "@/lib/downloads.config";
import { stashAndSign, downloadUrl, signedLinkConfigured } from "@/lib/signedLink";
import { renderDownloadEmail } from "@/lib/downloadEmail";

/**
 * /api/download — email a signed, expiring link to a static IAS cheatsheet PDF.
 *
 * Flow (IAS "link, don't attach" pattern — Option A, identical mechanic to
 * AgentForge/BrandForge, adapted for a STATIC file instead of a generated one):
 *
 *   browser → this route →
 *     1. validate email + resolve the download from downloads.config
 *     2. FETCH the PDF bytes from the iasbootcamp/iasdownloads repo (raw URL)
 *     3. stashAndSign() the bytes into Upstash behind a /d/<token> link (24h TTL)
 *     4. Resend emails the link (no attachment)
 *     5. fire-and-forget lead event → n8n → HubSpot (segmentation)
 *
 * Governance (Article IX — honest by construction):
 * - No fabricated success. If the PDF isn't published yet (404 from the repo)
 *   or signed links aren't configured, we return a real error the UI can show,
 *   NOT a "check your email" that never arrives.
 * - PDF bytes are base64 through the signed-link cache; /d/[token] streams them
 *   back with the right Content-Type. The file is served from OUR domain.
 *
 * runtime = nodejs: signedLink.ts uses node:crypto (HMAC) and Buffer.
 */
export const runtime = "nodejs";

const isEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || "").trim());

export async function POST(req: NextRequest) {
  let body: { email?: string; slug?: string; firstName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const slug = String(body.slug ?? "").trim();

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 422 });
  }

  const download = getDownload(slug);
  if (!download) {
    return NextResponse.json({ ok: false, error: "Unknown download." }, { status: 404 });
  }

  // Honest gate: a "soon" download has no published PDF. Don't capture a lead
  // for a file we can't deliver — tell the truth instead.
  if (download.status !== "live") {
    return NextResponse.json(
      { ok: false, error: "This cheatsheet isn't published yet. Check back soon." },
      { status: 409 },
    );
  }

  if (!signedLinkConfigured) {
    // Option A REQUIRES signed links (DOWNLOAD_SECRET + Upstash). We never fall
    // back to attaching a PDF — an attachment is the spam signal we're avoiding.
    console.error("[download] signed links not configured — refusing to attach.");
    return NextResponse.json(
      { ok: false, error: "Downloads are temporarily unavailable." },
      { status: 503 },
    );
  }

  // ── 1. Fetch the static PDF from the source repo ───────────────────────────
  const pdfSrc = rawPdfUrl(download);
  let pdfBase64: string;
  try {
    const res = await fetch(pdfSrc, { cache: "no-store" });
    if (!res.ok) {
      // 404 = PDF not published at pdfs/<slug>.pdf yet. Honest failure.
      console.error(`[download] PDF fetch ${res.status} for ${pdfSrc}`);
      return NextResponse.json(
        { ok: false, error: "This cheatsheet isn't available right now. Check back soon." },
        { status: 502 },
      );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    pdfBase64 = buf.toString("base64");
  } catch (e) {
    console.error("[download] PDF fetch error:", e);
    return NextResponse.json(
      { ok: false, error: "Couldn't retrieve the file. Try again in a moment." },
      { status: 502 },
    );
  }

  // ── 2. Stash the bytes behind a signed, expiring /d/<token> link ───────────
  // signedLink.ts stores the content as-is and /d/[token] streams it back with
  // the mime we set here. We store base64 + declare mime so the redeem route
  // returns valid PDF bytes. (Content is opaque to the cache; the token carries
  // filename + mime.)
  const token = await stashAndSign({
    content: pdfBase64,
    filename: download.pdfName,
    mime: "application/pdf",
  });
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Downloads are temporarily unavailable." },
      { status: 503 },
    );
  }
  const origin =
    req.headers.get("origin") || process.env.PUBLIC_ORIGIN || "https://www.iasbootcamp.com";
  const link = downloadUrl(origin, token);

  // ── 3. Email the link (Resend), no attachment ─────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[download] RESEND_API_KEY unset.");
    return NextResponse.json({ ok: false, error: "Email service not configured." }, { status: 500 });
  }
  const resend = new Resend(apiKey);

  const firstName =
    (String(body.firstName ?? "").trim() ||
      (email.split("@")[0] || "there").split(/[._-]/)[0]).replace(/^\w/, (c) => c.toUpperCase());
  const unsubscribeUrl = `${origin.replace(/\/$/, "")}/unsubscribe?e=${encodeURIComponent(email)}`;

  const html = renderDownloadEmail({
    download_title: download.title,
    first_name: firstName,
    download_url: link,
    unsubscribe_url: unsubscribeUrl,
  });
  const text = [
    `Your cheatsheet — ${download.title} — is ready.`,
    `Download it here (link expires in 24 hours): ${link}`,
    ``,
    `It's a preformatted PDF. Save it, print it, keep it open while you build.`,
    `— IAS`,
  ].join("\n");

  try {
    await resend.emails.send({
      from: process.env.SEND_FROM || "IAS <build@i-automate-shit.com>",
      to: email,
      subject: `Your cheatsheet: ${download.title}`,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:unsubscribe@i-automate-shit.com>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (e) {
    console.error("[download] Resend error:", e);
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 502 });
  }

  // ── 4. Lead segmentation via n8n → HubSpot (fire-and-forget) ───────────────
  // Reuses the same webhook + secret + source-tag contract as /api/lead. n8n
  // upserts by email; a live paid relationship outranks this free-download tag,
  // so an existing student/subscriber keeps their standing and just gains the
  // download event. Never overwrites a higher-value persona.
  const hook = process.env.N8N_LEAD_WEBHOOK_URL;
  if (hook) {
    const record = {
      stage: "download",
      email,
      first_name: firstName,
      source: "ias-downloads",
      ias_source: "download_lead",
      ias_last_asset: `download:${download.slug}`,
      download_slug: download.slug,
      download_title: download.title,
      submitted_at: new Date().toISOString(),
      user_agent: req.headers.get("user-agent") ?? "",
    };
    try {
      await fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.N8N_WEBHOOK_SECRET ? { "x-ias-secret": process.env.N8N_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify(record),
      });
    } catch (e) {
      console.error("[download] lead webhook error:", e);
    }
  } else {
    console.warn("[download] N8N_LEAD_WEBHOOK_URL unset — download event not forwarded.");
  }

  return NextResponse.json({ ok: true });
}

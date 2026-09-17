// lib/downloadEmail.ts
// IAS cheatsheet delivery email — "Plain Jane" theme, LINK delivery (no attachment).
// Adapted from the AgentForge delivery template: same brand shell (logo, social
// bar, footer), download-specific body copy. The PDF is served via a signed,
// expiring /d/<token> link on our own domain — an attachment from a young domain
// is a Gmail spam signal; a same-domain link is a trust signal.
// Tokens: download_title, first_name, download_url, unsubscribe_url.

const TEMPLATE = `<!--
  ==============================================================================
  TEMPLATE:       Download Delivery Template
  FILE ID:        download.html
  VERSION:        1.0.0
  THEME:          Plain Jane
  DESCRIPTION:    IAS Bootcamp cheatsheet delivery email.
  MAINTAINER:     IAS Ecosystem <support@i-automate-shit.com>
  DOCUMENTATION:  https://i-automate-shit.com
  ==============================================================================
-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <title>Your IAS cheatsheet</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
      a { color:#0A2E36; }
      @media screen and (max-width:600px) {
        .card { width:100% !important; border-radius:0 !important; }
        .pad { padding-left:20px !important; padding-right:20px !important; }
        .h1 { font-size:24px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#FFF;">

    <!-- PREHEADER -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#FFF;">Your cheatsheet is ready — here's the download link.</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF;">
      <tr>
        <td align="center" style="padding:32px 12px;">

        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#FFFFFF;border:1px solid #FFF;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#FFF;padding:26px 24px 22px;text-align:center;border-radius:12px 12px 0 0;">
              <a href="https://www.i-automate-shit.com" style="text-decoration:none;">
                <img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/logo.png" alt="Logo" width="150" style="display:block;margin:0 auto;">
              </a>
              <div style="font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;letter-spacing:0.14em;color:#00E5A3;text-transform:uppercase;margin-top:16px;">
                I-AUTOMATE-SHIT.COM
              </div>
            </td>
          </tr>
          <tr>
            <td style="height:6px;padding:0;font-size:0;line-height:0;"></td>
          </tr>
          <tr>
            <td class="pad" style="padding:32px 36px 8px;">

              <span style="display:inline-block;font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0A2E36;background:#00E5A3;padding:5px 11px;border-radius:5px;margin-bottom:16px;">&#9679; Your cheatsheet is ready</span>

              <h1 class="h1" style="font-family:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:28px;font-weight:700;color:#0A2E36;line-height:1.15;letter-spacing:-0.01em;margin:0 0 14px;">{{download_title}}</h1>

              <p style="font-family:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111827;margin:0 0 22px;">What's up {{first_name}} — here's the cheatsheet you asked for. It's a preformatted PDF: save it, print it, keep it open while you build.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 10px;"><tr><td align="center"><a href="{{download_url}}" style="display:inline-block;background:#00E5A3;color:#0A2E36;font-family:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;text-align:center;padding:16px 32px;border-radius:6px;">Download the PDF &rarr;</a></td></tr></table>
              <p style="font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.6;color:#6B7280;margin:0 0 24px;text-align:center;">Link expires in 24 hours. Need it again? Grab a fresh one from the downloads page.</p>

              <p style="font-family:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6B7280;margin:0 0 8px;">Want to see these in action on a real build? <a href="https://www.youtube.com/@iautomatesht" style="color:#0A2E36;font-weight:700;text-decoration:underline;">Watch a live session</a>.</p>

            </td>
          </tr>

          <tr>
            <td style="padding:0 0 15px 0;">
              <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0 20px;">
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 8px;text-align:center;">
              <a href="https://www.i-automate-shit.com" style="text-decoration:none;">
                <img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/logo.png" alt="Logo" width="175" style="display:block;margin:0 auto;">
              </a>
            </td></tr>
          <tr>
            <td style="padding:14px 24px 6px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 5px;"><a href="https://www.linkedin.com/company/ias-bootcamp" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_linkedin.jpg" alt="LinkedIn" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://www.facebook.com/profile.php?id=61593049247788" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_facebook.jpg" alt="Facebook" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://www.instagram.com/iautomatesht" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_instagram.jpg" alt="Instagram" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://www.threads.com/@iautomatesht" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_threads.jpg" alt="Threads" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://www.tiktok.com/@iautomateshit" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_tiktok.jpg" alt="TikTok" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://x.com/iautomaterobots" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_twitter.jpg" alt="Twitter" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 5px;"><a href="https://www.youtube.com/@iautomatesht" target="_blank" style="text-decoration:none;"><img src="https://raw.githubusercontent.com/elwoodberry3/IAS-Portfolio-v.2.0.1/refs/heads/main/assets/images/email/icon_youtube.jpg" alt="YouTube" width="24" height="24" style="display:block;border:0;"></a></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:50px 0;text-align:center;">
              <p style="font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:#6B7280;margin:0 0 4px;">I Automate Shit...&#8482; &#183; Dallas, TX</p>
              <p style="font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:#6B7280;margin:0;">
                <a href="https://www.i-automate-shit.com/" style="color:#3F7266;text-decoration:underline;">i-automate-shit.com</a> &nbsp;&#183;&nbsp;
                <a href="https://www.iasbootcamp.com/" style="color:#3F7266;text-decoration:underline;">iasbootcamp.com</a> &nbsp;&#183;&nbsp;
                <a href="{{unsubscribe_url}}" style="color:#6B7280;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
    </table>

          <p style="font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:10px;color:#6B7280;margin:16px 0 0;">Built once. Distributed everywhere.</p>

        </td>
      </tr>
    </table>
  </body>
</html>`;

export function renderDownloadEmail(vars: {
  download_title: string;
  first_name: string;
  download_url: string;
  unsubscribe_url: string;
}): string {
  return TEMPLATE.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_m, k: string) =>
    vars[k as keyof typeof vars] != null ? String(vars[k as keyof typeof vars]) : ""
  );
}

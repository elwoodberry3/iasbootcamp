/**
 * Normalize & Validate — unified.
 * Cleans payload, validates email, captures BOTH axes:
 * 
 * ias_source  = persona / which door (enum-bound in HubSpot)
 * ias_last_asset = campaign / what they touched (free text, never lossy)
 * 
 * stage tells us the funnel: contact | bootcamp | download | tool.
 */

const b = $json.body ?? $json;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const email = String(b.email ?? '').trim().toLowerCase();
if (!EMAIL_RE.test(email)) { return []; } // drop invalid; browser already got 200

const firstName = String(b.first_name ?? b.firstName ?? b.firstname ?? '').trim();
const stage = String(b.stage ?? '').trim().toLowerCase(); // contact|bootcamp|download|tool|''
const isDownload = stage === 'download';

// intent: confirmed vs waitlist (bootcamp only). Non-'waitlist' => confirmed.
const intent = String(b.intent ?? 'confirmed').trim().toLowerCase() === 'waitlist' ? 'waitlist' : 'confirmed';

// Raw persona hint from the front end (may be blank). Validated later.
const iasSourceRaw = String(b.ias_source ?? '').trim();

// Campaign axis: real slug wins, else brand_name (BrandForge), else tool, else source.
const lastAsset = String(
  b.ias_last_asset
    || (b.brand_name ? ('brand-guide:' + b.brand_name) : '')
    || b.tool
    || b.source
    || stage
    || 'submission'
).trim();

const nowIso = new Date().toISOString();

return [{ json: {
  email,
  firstName,
  stage,
  isDownload,
  intent,
  iasSourceRaw,
  lastAsset,
  tool: String(b.tool ?? '').trim(),
  source: String(b.source ?? '').trim(),
  nowIso,
  searchBody: {
    filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
    properties: ['email','firstname','ias_source','ias_last_asset','drip_status','submission_count','suppressed'],
    limit: 1
  }
}}];
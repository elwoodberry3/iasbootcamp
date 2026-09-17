/**
 * Resolve Persona + Rules — the shared brain.
 * Promotes tool-capture.json's rank resolver to ALL funnels.
 * LOWER rank number wins. Employment personas sit at the top so a Toyota
 * hiring manager is NEVER downgraded by a later bootcamp/tool signup.
 *
 * MODE: Run Once for Each Item — returns a single { json: {...} } object.
 */
const input = $('Normalize & Validate').item.json;
const search = $json;
const existing = (search.results && search.results[0]) ? search.results[0] : null;
const existingId = existing ? existing.id : null;
const ep = existing ? (existing.properties || {}) : {};
const existingSource = ep.ias_source || null;
const existingCount = parseInt(ep.submission_count || '0', 10);
const suppressed = ep.suppressed === 'true';
const existingDrip = ep.drip_status || '';

// ---- Persona axis: map raw front-end source -> valid HubSpot enum ----
const VALID = ['portfolio_hiring_manager','portfolio_recruiter','portfolio_exec','bootcamp_subscriber','tool_agentforge','tool_brandforge'];
const SOURCE_MAP = {
  'contact': 'portfolio_exec',
  'portfolio': 'portfolio_exec',
  'hiring_manager': 'portfolio_hiring_manager',
  'recruiter': 'portfolio_recruiter',
  'ias-vsl': 'bootcamp_subscriber',
  'bootcamp': 'bootcamp_subscriber',
  'ias-downloads': 'bootcamp_subscriber', // TODO: add 'download_lead' enum option, then map here
  'download': 'bootcamp_subscriber',
  'agentforge-tool': 'tool_agentforge',
  'brandforge-tool': 'tool_brandforge'
};
// Prefer an explicit valid ias_source from the front end; else map raw source; else stage; else safe default.
let incomingSource =
  (input.iasSourceRaw && VALID.includes(input.iasSourceRaw)) ? input.iasSourceRaw
  : (SOURCE_MAP[input.iasSourceRaw] || SOURCE_MAP[input.source] || SOURCE_MAP[input.stage] || 'bootcamp_subscriber');

// ---- Ranked retag: higher-value persona is sticky ----
const RANK = { portfolio_hiring_manager:1, portfolio_recruiter:1, portfolio_exec:2, tool_agentforge:3, tool_brandforge:3, bootcamp_subscriber:4 };
function resolveRetag(ex, inc){ if(!ex || !(ex in RANK)) return inc; return (RANK[inc] < RANK[ex]) ? inc : ex; }
const finalSource = resolveRetag(existingSource, incomingSource);

// ---- Classify for routing ----
const isHighValue = finalSource === 'portfolio_hiring_manager' || finalSource === 'portfolio_recruiter';
const isDownload = input.isDownload;
const isExistingSubscriber = existing && (existingSource === 'bootcamp_subscriber' || existingDrip === 'active' || existingDrip === 'enrolled');
const isWaitlist = input.intent === 'waitlist';
const nowIso = input.nowIso;

// ---- Build HubSpot props ----
let props = {
  email: input.email,
  ias_source: finalSource,
  ias_last_asset: input.lastAsset,
  last_submitted_at: nowIso,
  submission_count: String(existingCount + 1)
};
if (input.firstName) props.firstname = input.firstName;

// Drip decision is SEPARATE from persona.
if (isHighValue) {
  // Employment pillar firing live. Never drip. Flag + alert.
  props.drip_status = 'suppressed_high_value';
} else if (isDownload) {
  // Download: tag only. App mints Upstash link + sends via Resend.
  if (!existing) { props.lifecyclestage = 'subscriber'; if (!existingDrip) props.drip_status = 'tool_user_unconverted'; }
} else if (finalSource === 'tool_agentforge' || finalSource === 'tool_brandforge') {
  // Tool-only lead nurture track (unless already a real subscriber).
  if (!existing) { props.lifecyclestage = 'subscriber'; props.drip_status = 'tool_user_unconverted'; props.suppressed = 'false'; }
  else if (!isExistingSubscriber && !existingDrip) { props.drip_status = 'tool_user_unconverted'; }
} else {
  // Bootcamp / VSL.
  if (!existing) {
    props.lifecyclestage = 'subscriber';
    props.drip_status = isWaitlist ? 'waitlist' : 'enrolled';
    props.drip_started_at = nowIso;
    props.drip_last_step = '0';
    props.suppressed = 'false';
  }
  // If existing subscriber already enrolled: usage props only (idempotent).
}

// What downstream branches need.
const route = isHighValue ? 'high_value' : (isDownload ? 'download' : (isExistingSubscriber ? 'existing' : 'bootcamp'));

return { json: {
  existingId, suppressed, finalSource, route,
  isHighValue, isDownload, isExistingSubscriber,
  email: input.email, firstName: input.firstName, lastAsset: input.lastAsset,
  stage: input.stage, nowIso, props
}};
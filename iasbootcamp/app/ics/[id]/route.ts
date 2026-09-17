import { NextRequest } from 'next/server';
import calendar from '@/data/stream-calendar.json';

export const dynamic = 'force-static'; // cache; these rarely change
export const revalidate = 3600;

// Fold long lines per RFC 5545 (75 octets max, continuation lines start with a space).
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const chunks: string[] = [];
  let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch, 'utf8') > 74) { chunks.push(cur); cur = ' ' + ch; }
    else { cur += ch; }
  }
  if (cur) chunks.push(cur);
  return chunks.join('\r\n');
}

// Escape per RFC 5545: backslash, semicolon, comma, newline.
function esc(s: string): string {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// UTC stamp: 20260314T230000Z
function toUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slug = id.replace(/\.ics$/i, ''); // tolerate /ics/<id> and /ics/<id>.ics

  const stream = (calendar.streams as any[]).find((s) => s.id === slug);
  if (!stream) {
    return new Response('Not found', { status: 404 });
  }

  const start = new Date(stream.datetime);
  const end = new Date(start.getTime() + (stream.duration_minutes ?? 120) * 60000);
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//I Automate Shit//IAS Bootcamp//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${slug}@iasbootcamp.com`,
    `DTSTAMP:${toUtc(now.toISOString())}`,
    `DTSTART:${toUtc(start.toISOString())}`,
    `DTEND:${toUtc(end.toISOString())}`,
    fold(`SUMMARY:${esc(stream.title)}`),
    fold(`DESCRIPTION:${esc(stream.description ?? '')}${stream.youtube_live_url ? esc('\n\nWatch: ' + stream.youtube_live_url) : ''}`),
    fold(`LOCATION:${esc(stream.location ?? 'YouTube Live')}`),
    stream.youtube_live_url ? fold(`URL:${esc(stream.youtube_live_url)}`) : '',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(stream.title)} starts in 30 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const body = lines.join('\r\n') + '\r\n'; // RFC requires CRLF

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
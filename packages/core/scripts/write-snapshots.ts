import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calendarEntries, calcParams, commodities, guides, pests, searchIndex, site, symptoms, zones,
} from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../../apps/web/public/data');
mkdirSync(out, { recursive: true });

const snapshots: Record<string, unknown> = {
  'commodities.json': commodities,
  'crop_calendar.json': calendarEntries,
  'zones.json': zones,
  'pests.json': pests,
  'symptoms.json': symptoms,
  'guides.json': guides,
  'calc_params.json': calcParams,
  'search-index.json': searchIndex,
};

for (const [file, data] of Object.entries(snapshots)) {
  writeFileSync(resolve(out, file), JSON.stringify(data, null, 2));
}

writeFileSync(
  resolve(out, 'manifest.json'),
  JSON.stringify(
    {
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      counts: Object.fromEntries(Object.entries(snapshots).map(([k, v]) => [k.replace('.json', ''), (v as unknown[]).length])),
      note: 'Snapshot statis dibuat saat build. Web publik tidak memanggil Supabase saat runtime.',
    },
    null,
    2
  )
);

/* RSS statis untuk static export (route handler Next.js tidak tersedia di mode export). */
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[char] ?? char));
const rssItems = [...guides]
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .map((guide) => `    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${site.domain}/panduan/${guide.slug}</link>
      <guid isPermaLink="true">${site.domain}/panduan/${guide.slug}</guid>
      <description>${escapeXml(guide.summary)}</description>
      <pubDate>${new Date(guide.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(guide.author)}</dc:creator>
    </item>`)
  .join('\n');
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${site.name} — Panduan</title>
    <link>${site.domain}</link>
    <description>${escapeXml(site.description)}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;
writeFileSync(resolve(out, '../rss.xml'), rss);

console.log(`Wrote ${Object.keys(snapshots).length + 1} snapshots and rss.xml to ${out}`);

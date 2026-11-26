import { guides, site } from '@sabditani/core';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[char] ?? char));

export function GET() {
  const items = [...guides]
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${site.name} — Panduan</title>
    <link>${site.domain}</link>
    <description>${escapeXml(site.description)}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}

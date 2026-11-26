import Link from 'next/link';
import { slugify } from '@sabditani/core';

function inline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, url] = link;
      return url.startsWith('http')
        ? <a key={key} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
        : <Link key={key} href={url}>{label}</Link>;
    }
    return <span key={key}>{part}</span>;
  });
}

export function extractHeadings(markdown: string) {
  return markdown
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => ({ title: line.replace(/^##\s+/, ''), id: slugify(line.replace(/^##\s+/, '')) }));
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let callout: { kind: 'catatan' | 'peringatan'; content: string[] } | null = null;
  let table: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={`p-${blocks.length}`}>{inline(paragraph.join(' '), `p-${blocks.length}`)}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      const items = list.items.map((item, i) => <li key={i}>{inline(item, `li-${blocks.length}-${i}`)}</li>);
      blocks.push(list.ordered ? <ol key={`ol-${blocks.length}`}>{items}</ol> : <ul key={`ul-${blocks.length}`}>{items}</ul>);
      list = null;
    }
  };
  const flushCallout = () => {
    if (callout) {
      blocks.push(
        <div key={`callout-${blocks.length}`} className={`callout${callout.kind === 'peringatan' ? ' warning' : ''}`}>
          <strong>{callout.kind === 'peringatan' ? 'Peringatan' : 'Catatan'}</strong>
          {callout.content.map((line, i) => <span key={i}>{inline(line, `c-${blocks.length}-${i}`)} </span>)}
        </div>
      );
      callout = null;
    }
  };
  const flushTable = () => {
    if (table) {
      const rows = table.filter((row) => !/^\|[\s|:-]+\|$/.test(row));
      const cells = rows.map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()));
      const [header, ...body] = cells;
      blocks.push(
        <div key={`table-${blocks.length}`} className="table-scroll" role="region" aria-label="Tabel data, dapat digeser secara horizontal" tabIndex={0}>
          <table>
            <thead><tr>{header.map((cell, i) => <th key={i}>{inline(cell, `th-${i}`)}</th>)}</tr></thead>
            <tbody>
              {body.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inline(cell, `td-${i}-${j}`)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      );
      table = null;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith(':::')) {
      if (trimmed === ':::') { flushCallout(); return; }
      flushParagraph(); flushList(); flushTable();
      const kind = trimmed.replace(/^:::/, '') === 'peringatan' ? 'peringatan' : 'catatan';
      callout = { kind, content: [] };
      return;
    }
    if (callout) { callout.content.push(trimmed); return; }
    if (trimmed.startsWith('[[')) {
      flushParagraph(); flushList(); flushTable();
      if (trimmed === '[[diagnosa]]') {
        blocks.push(
          <div key={`tool-${blocks.length}`} className="tool-inline">
            <div><strong>Cek gejala tanaman Anda</strong><p className="muted small">Wizard singkat, hasil berupa kemungkinan penyebab.</p></div>
            <Link className="btn btn-primary btn-small" href="/app/diagnosa">Mulai diagnosa</Link>
          </div>
        );
      } else {
        const tool = trimmed.match(/\[\[hitung:([^\]]+)\]\]/)?.[1];
        if (tool) {
          blocks.push(
            <div key={`tool-${blocks.length}`} className="tool-inline">
              <div><strong>Hitung sendiri di sini</strong><p className="muted small">Angka berubah seketika saat Anda mengisi data.</p></div>
              <Link className="btn btn-primary btn-small" href={`/app/alat/${tool}`}>Buka alat</Link>
            </div>
          );
        }
      }
      return;
    }
    if (trimmed.startsWith('|')) { flushParagraph(); flushList(); (table ??= []).push(trimmed); return; }
    flushTable();
    if (/^###?\s/.test(trimmed)) {
      flushParagraph(); flushList();
      const level = trimmed.startsWith('### ') ? 3 : 2;
      const title = trimmed.replace(/^#{2,3}\s+/, '');
      const id = slugify(title);
      blocks.push(level === 2
        ? <h2 key={`h-${blocks.length}`} id={id}>{inline(title, `h-${blocks.length}`)}</h2>
        : <h3 key={`h-${blocks.length}`} id={id}>{inline(title, `h-${blocks.length}`)}</h3>);
      return;
    }
    const ordered = /^\d+\.\s/.test(trimmed);
    const unordered = /^[-*]\s/.test(trimmed);
    if (ordered || unordered) {
      flushParagraph();
      const content = trimmed.replace(/^(\d+\.|[-*])\s+/, '');
      if (list && list.ordered === ordered) list.items.push(content);
      else { flushList(); list = { ordered, items: [content] }; }
      return;
    }
    flushList();
    if (!trimmed) { flushParagraph(); return; }
    paragraph.push(trimmed);
  });

  flushParagraph(); flushList(); flushCallout(); flushTable();
  return <div className="article">{blocks}</div>;
}

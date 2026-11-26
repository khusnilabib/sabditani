'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { groupLabels, searchGroups, searchIndex, searchItems } from '@sabditani/core';
import { IconArrow, IconSearch } from '@/components/Icons';

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchItems(searchIndex, query, 40), [query]);

  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Pencarian</span><h1>Cari</h1>
        <p className="muted">Cari panduan, komoditas, hama, atau alat. Tekan Ctrl/⌘ + K dari halaman mana pun untuk membuka pencarian cepat.</p>
      </div>
      <div className="input-with-unit" style={{ maxWidth: 640, marginBottom: 32 }}>
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Misalnya: pupuk cabai, kutu keputih, populasi" aria-label="Kata kunci pencarian" />
      </div>
      {!query && (
        <div className="notice">Coba kata kunci: <strong>pupuk</strong>, <strong>cabai</strong>, <strong>hawar</strong>, atau <strong>populasi</strong>.</div>
      )}
      {query && results.length === 0 && (
        <div className="empty-state"><h3>Belum ada hasil</h3><p className="muted">Coba kata kunci yang lebih umum atau periksa ejaan.</p></div>
      )}
      {searchGroups.map((group) => {
        const items = results.filter((item) => item.type === group);
        if (!items.length) return null;
        return (
          <section key={group} style={{ marginBottom: 32 }}>
            <span className="eyebrow">{groupLabels[group]}</span>
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {items.map((item) => (
                <Link key={`${item.type}-${item.url}`} href={item.url} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: 16 }}>
                  <div><strong>{item.title}</strong><p className="muted small">{item.summary}</p></div>
                  <IconArrow style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--primary)' }} />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {!query && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: 14 }}>
          <IconSearch style={{ width: 16, height: 16 }} /> Ketik untuk mulai mencari.
        </div>
      )}
    </>
  );
}

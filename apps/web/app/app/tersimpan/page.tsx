'use client';

import Link from 'next/link';
import { formatDate } from '@sabditani/core';
import { useSaved } from '@/hooks/useSaved';
import { IconBookmark, IconExternal } from '@/components/Icons';

export default function SavedPage() {
  const { items, remove, clear, ready } = useSaved();

  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Perangkat Anda</span><h1>Tersimpan</h1>
        <p className="muted">Hitungan dan panduan yang Anda simpan tetap ada setelah peramban ditutup. Data ini tidak dikirim ke server.</p>
      </div>
      {!ready ? <p className="muted">Memuat data tersimpan…</p> : items.length === 0 ? (
        <div className="empty-state">
          <IconBookmark style={{ width: 32, height: 32, margin: '0 auto 12px', color: 'var(--ink-muted)' }} />
          <h3>Belum ada hitungan tersimpan</h3>
          <p className="muted">Coba Hitung Pupuk, lalu tekan tombol Simpan.</p>
          <Link className="btn btn-primary btn-small" style={{ marginTop: 16 }} href="/app/alat/pupuk">Coba Hitung Pupuk</Link>
        </div>
      ) : (
        <>
          <div className="panel">
            {items.map((item) => (
              <div className="saved-item" key={item.id}>
                <div>
                  <span className="tag">{item.type}</span>
                  <h3 style={{ fontSize: 18, margin: '8px 0 4px' }}>{item.title}</h3>
                  <p className="muted small">{item.detail}</p>
                  <p className="muted small" style={{ marginTop: 4 }}>{formatDate(item.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {item.url && <Link className="btn btn-secondary btn-small" href={item.url}>Buka</Link>}
                  <button className="btn btn-secondary btn-small" onClick={() => remove(item.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
          <div className="action-row">
            <button className="btn btn-secondary btn-small" onClick={() => {
              const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'sabditani-tersimpan.json'; a.click(); URL.revokeObjectURL(url);
            }}>Ekspor JSON</button>
            <button className="btn btn-secondary btn-small" onClick={() => { if (confirm('Hapus semua data tersimpan di perangkat ini?')) clear(); }}>Hapus semua</button>
            <Link className="text-link" href="/panduan">Jelajahi panduan <IconExternal style={{ width: 12, height: 12, display: 'inline' }} /></Link>
          </div>
        </>
      )}
    </>
  );
}

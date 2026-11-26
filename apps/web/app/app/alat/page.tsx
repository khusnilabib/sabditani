import Link from 'next/link';
import { tools } from '@sabditani/core';
import { IconArrow, IconCalculator } from '@/components/Icons';

export const metadata = { title: 'Alat Hitung' };

export default function ToolsPage() {
  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Alat hitung</span>
        <h1>Alat Hitung</h1>
        <p className="muted">Isi angka Anda, hasil berubah seketika. Setiap hasil menampilkan asumsi yang dipakai.</p>
      </div>
      <div className="grid-3">
        {tools.map((tool, index) => (
          <Link key={tool.slug} href={`/app/alat/${tool.slug}`} className="card card-hover">
            <IconCalculator style={{ width: 26, height: 26, color: 'var(--primary)' }} />
            <h3 style={{ fontSize: 22, marginTop: 16 }}>{tool.name}</h3>
            <p>{tool.summary}</p>
            <div className="card-footer"><span>Alat 0{index + 1}</span><IconArrow style={{ width: 16, height: 16 }} /></div>
          </Link>
        ))}
      </div>
      <div className="notice" style={{ marginTop: 32 }}>Angka bawaan merupakan contoh. Ganti dengan data lahan Anda agar hasil lebih relevan.</div>
    </>
  );
}

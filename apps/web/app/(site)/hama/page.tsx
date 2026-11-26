import type { Metadata } from 'next';
import Link from 'next/link';
import { commodities, pests } from '@sabditani/core';

export const metadata: Metadata = { title: 'Hama & Penyakit', description: 'Database hama, penyakit, gulma, dan kekurangan hara lengkap dengan gejala serta pengendalian bertingkat.' };

export default function PestsPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Hama & Penyakit</span></div>
          <span className="eyebrow">Katalog gejala</span><h1>Hama & Penyakit</h1>
          <p>Kenali penyebabnya dari gejala yang terlihat, lalu ikuti pengendalian berurutan: budidaya, hayati, baru kimia bila perlu.</p>
        </div>
      </header>
      <div className="container" style={{ padding: '48px 0 96px' }}>
        <div style={{ marginBottom: 32 }}>
          <Link className="btn btn-primary" href="/app/diagnosa">Coba Diagnosa Gejala →</Link>
        </div>
        <div className="grid-3">
          {pests.map((pest) => (
            <Link key={pest.id} href={`/hama/${pest.slug}`} className="card card-hover">
              <span className="tag">{pest.kind}</span><h3 style={{ marginTop: 12 }}>{pest.name}</h3><p>{pest.summary}</p>
              <div className="card-footer">
                <span>{pest.commodityIds.map((id) => commodities.find((c) => c.id === id)?.name).filter(Boolean).join(', ')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

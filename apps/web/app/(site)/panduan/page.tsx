import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, formatDate, guides } from '@sabditani/core';
import { VerifiedSeal } from '@/components/VerifiedSeal';

export const metadata: Metadata = {
  title: 'Panduan',
  description: 'Panduan budidaya, pemupukan, hama, dan usaha tani yang ditulis serta diperiksa oleh penulis lapangan.',
};

export default function PanduanPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Panduan</span></div>
          <span className="eyebrow">Perpustakaan tani</span>
          <h1>Panduan</h1>
          <p>Langkah kerja yang ditulis jelas, disertai penulis, tanggal, dan penanda terverifikasi lapangan bila sudah diperiksa.</p>
        </div>
      </header>
      <div className="container" style={{ padding: '32px 0 96px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          <Link className="btn btn-secondary btn-small" href="/panduan">Semua</Link>
          {categories.map((category) => (
            <Link key={category.slug} className="btn btn-secondary btn-small" href={`/kategori/${category.slug}`}>{category.name}</Link>
          ))}
        </div>
        <div className="grid-2">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/panduan/${guide.slug}`} className="card card-hover">
              {guide.coverUrl && <img className="guide-card-cover" src={guide.coverUrl} alt="" loading="lazy" width={800} height={450} />}
              <span className="tag">{categories.find((c) => c.slug === guide.category)?.name ?? guide.category}</span>
              <h3 style={{ marginTop: 12 }}>{guide.title}</h3>
              <p>{guide.summary}</p>
              <div className="card-footer">
                <span>{formatDate(guide.updatedAt)} · {guide.readingMinutes} menit baca</span>
                {guide.fieldVerified && <VerifiedSeal when={guide.verifiedAt} />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

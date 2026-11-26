import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { commodities, pests, symptoms, site } from '@sabditani/core';
import { Markdown } from '@/components/Markdown';

export function generateStaticParams() { return pests.map((pest) => ({ slug: pest.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pest = pests.find((item) => item.slug === slug);
  return { title: pest ? `${pest.name} — Hama & Penyakit` : 'Tidak ditemukan', description: pest?.summary };
}

export default async function PestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pest = pests.find((item) => item.slug === slug);
  if (!pest) notFound();
  const related = symptoms.filter((symptom) => pest.symptomIds.includes(symptom.id));
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: pest.name, description: pest.summary,
    inLanguage: 'id', mainEntityOfPage: `${site.domain}/hama/${pest.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-head">
        <div className="container-narrow">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><Link href="/hama">Hama & Penyakit</Link><span>/</span><span>{pest.name}</span></div>
          <span className="eyebrow">{pest.kind}</span><h1>{pest.name}</h1><p>{pest.summary}</p>
        </div>
      </header>
      <div className="container-narrow" style={{ padding: '48px 0 96px' }}>
        <div className="panel" style={{ marginBottom: 32 }}>
          <span className="panel-title">Penyebab</span><p>{pest.cause}</p>
          <p className="muted small" style={{ marginTop: 16 }}>Komoditas: {pest.commodityIds.map((id) => commodities.find((c) => c.id === id)?.name).filter(Boolean).join(', ')}</p>
        </div>
        <div className="panel" style={{ marginBottom: 32 }}>
          <span className="panel-title">Gejala yang biasa muncul</span>
          <ul>{related.map((symptom) => <li key={symptom.id} style={{ marginBottom: 8 }}><strong>{symptom.name}</strong> — <span className="muted">{symptom.description}</span></li>)}</ul>
          <Link className="text-link" href="/app/diagnosa" style={{ display: 'inline-block', marginTop: 12 }}>Periksa gejala tanaman Anda →</Link>
        </div>
        <Markdown source={pest.controlMd} />
        <div className="callout warning" style={{ marginTop: 40 }}>
          <strong>Peringatan keselamatan</strong>
          Gunakan sarung tangan dan masker saat menyemprot. Ikuti dosis pada label, hindari aplikasi saat serangga penyerbuk aktif, dan pastikan dengan penyuluh setempat sebelum memakai pestisida.
        </div>
      </div>
    </>
  );
}

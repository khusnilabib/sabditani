import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  activityLabels, calendarEntries, commodities, guides, pests, zones, formatDate, windowLabel,
} from '@sabditani/core';
import { VerifiedSeal } from '@/components/VerifiedSeal';

export function generateStaticParams() { return commodities.map((crop) => ({ slug: crop.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const crop = commodities.find((item) => item.slug === slug);
  return { title: crop ? `Komoditas ${crop.name}` : 'Komoditas tidak ditemukan', description: crop?.summary };
}

export default async function CommodityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const crop = commodities.find((item) => item.slug === slug);
  if (!crop) notFound();
  const zone = zones[0];
  const entries = calendarEntries.filter((e) => e.commodityId === crop.id && e.zoneId === zone.id);
  const relatedGuides = guides.filter((g) => g.commodityId === crop.id);
  const relatedPests = pests.filter((p) => p.commodityIds.includes(crop.id));

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><Link href="/komoditas">Komoditas</Link><span>/</span><span>{crop.name}</span></div>
          <span className="eyebrow">{crop.group}</span><h1>{crop.name}</h1><p>{crop.summary}</p>
        </div>
      </header>
      <div className="container" style={{ padding: '48px 0 96px' }}>
        <div className="grid-2">
          <div className="panel">
            <span className="panel-title">Tentang komoditas</span>
            <p>{crop.detail}</p>
            <p className="muted small" style={{ marginTop: 16 }}>Kebutuhan benih: <strong>{crop.seedRate}</strong></p>
            <Link className="btn btn-primary btn-small" style={{ marginTop: 20 }} href={`/app/kalender?komoditas=${crop.slug}&wilayah=${zone.slug}`}>Lihat di Kalender Tanam</Link>
          </div>
          <div className="panel">
            <span className="panel-title">Ringkasan kalender · {zone.name}</span>
            {entries.map((entry) => (
              <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px dashed var(--line)', fontSize: 14 }}>
                <span>{activityLabels[entry.activity]}</span><strong>{windowLabel(entry.startMonth, entry.endMonth)}</strong>
              </div>
            ))}
            <p className="muted small" style={{ marginTop: 16 }}>Jendela waktu bersifat indikatif dan dapat berubah antarwilayah serta antartahun.</p>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 64 }}><div><span className="eyebrow">Panduan</span><h2>Budidaya {crop.name}</h2></div></div>
        <div className="grid-3">
          {relatedGuides.map((guide) => (
            <Link key={guide.id} href={`/panduan/${guide.slug}`} className="card card-hover">
              <h3 style={{ fontSize: 19 }}>{guide.title}</h3><p>{guide.summary}</p>
              <div className="card-footer"><span>{formatDate(guide.updatedAt)}</span>{guide.fieldVerified && <VerifiedSeal when={guide.verifiedAt} />}</div>
            </Link>
          ))}
          {!relatedGuides.length && <div className="empty-state" style={{ gridColumn: '1 / -1' }}>Belum ada panduan khusus untuk komoditas ini.</div>}
        </div>

        <div className="section-head" style={{ marginTop: 64 }}><div><span className="eyebrow">Waspada</span><h2>Hama & penyakit yang sering muncul</h2></div></div>
        <div className="grid-3">
          {relatedPests.map((pest) => (
            <Link key={pest.id} href={`/hama/${pest.slug}`} className="card card-hover">
              <span className="tag">{pest.kind}</span><h3 style={{ fontSize: 19 }}>{pest.name}</h3><p>{pest.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

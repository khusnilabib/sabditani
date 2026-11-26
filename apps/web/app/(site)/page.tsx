import Link from 'next/link';
import {
  activeEntries, activityLabels, calendarEntries, commodities, formatDate, guides, seasonForMonth,
  seasonLabels, seasonMessage, site, tools, zones,
} from '@sabditani/core';
import { ContourBackdrop } from '@/components/ContourBackdrop';
import { VerifiedSeal } from '@/components/VerifiedSeal';
import { IconArrow, IconCalculator, IconCalendar, IconDiagnose, IconExternal } from '@/components/Icons';

export default function HomePage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const zone = zones[0];
  const season = seasonForMonth(zone.rainyMonths, month);
  const active = activeEntries(calendarEntries, 'cabai', zone.id, month);
  const latest = [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    alternateName: site.tagline,
    url: site.domain,
    description: site.description,
    inLanguage: 'id',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <ContourBackdrop />
        <div className="container hero-inner">
          <div>
            <span className="season-pill"><span className="dot" /> {seasonLabels[season]} · {zone.name}</span>
            <h1>Hari ini <em>di lahan</em></h1>
            <p className="lead">{seasonMessage(season)} Lihat apa yang sebaiknya Anda kerjakan sekarang, lalu hitung kebutuhannya dengan alat yang jelas asumsinya.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/app">Lihat yang cocok ditanam sekarang <IconArrow style={{ width: 18, height: 18 }} /></Link>
              <Link className="btn btn-secondary" href="/panduan">Baca panduan</Link>
            </div>
            <p className="muted small" style={{ marginTop: 20 }}>{formatDate(now)} · Panduan pertanian berbahasa Indonesia</p>
          </div>
          <aside className="hero-card" aria-label="Ringkasan kegiatan bulan ini">
            <span className="eyebrow">Sedang waktunya</span>
            <h3>Cabai · {zone.name}</h3>
            <p className="muted small">Bulan {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][month - 1]}</p>
            <div className="divider" />
            {active.length ? active.map((entry, index) => (
              <div className="hero-task" key={entry.id}>
                <span className="num">0{index + 1}</span>
                <div><strong>{activityLabels[entry.activity]}</strong><span>{entry.note}</span></div>
              </div>
            )) : (
              <p className="muted small">Belum ada jendela aktif untuk komoditas ini di wilayah pilihan. Coba komoditas lain di Kalender Tanam.</p>
            )}
            <Link className="text-link" style={{ display: 'inline-block', marginTop: 16 }} href="/app/kalender?komoditas=cabai&wilayah=jawa-rendah">
              Buka Kalender Tanam <IconArrow style={{ width: 14, height: 14, display: 'inline' }} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Empat pilar</span><h2>Dari pertanyaan menjadi keputusan</h2></div>
            <p className="muted small" style={{ maxWidth: '38ch' }}>Setiap bagian menjawab satu pertanyaan yang sering muncul sebelum Anda bertindak di lahan.</p>
          </div>
          <div className="grid-3">
            <Link href="/app" className="card card-hover">
              <span className="card-kicker">01 · Hari ini</span><h3>Apa yang dikerjakan sekarang?</h3>
              <p>Beranda kontekstual mengikuti bulan, musim, dan wilayah pilihan Anda.</p>
              <div className="card-footer">Buka beranda <IconArrow style={{ width: 16, height: 16 }} /></div>
            </Link>
            <Link href="/app/kalender" className="card card-hover">
              <span className="card-kicker">02 · Kalender</span><h3>Kapan waktu tanamnya?</h3>
              <p>Garis waktu 12 bulan untuk semai, tanam, pupuk, dan panen.</p>
              <div className="card-footer"><IconCalendar style={{ width: 16, height: 16 }} /> Lihat kalender</div>
            </Link>
            <Link href="/app/alat" className="card card-hover">
              <span className="card-kicker">03 · Hitung</span><h3>Berapa kebutuhannya?</h3>
              <p>Dosis pupuk, populasi tanam, dan analisis usaha dengan angka langsung.</p>
              <div className="card-footer"><IconCalculator style={{ width: 16, height: 16 }} /> Buka alat hitung</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Alat cepat</span><h2>Hitung sebelum Anda membeli</h2></div>
            <Link className="text-link" href="/app/alat">Semua alat <IconExternal style={{ width: 14, height: 14, display: 'inline' }} /></Link>
          </div>
          <div className="grid-3">
            {tools.map((tool, index) => (
              <Link key={tool.slug} href={`/app/alat/${tool.slug}`} className="card card-hover">
                <span className="card-kicker">Alat 0{index + 1}</span><h3>{tool.name}</h3><p>{tool.summary}</p>
                <div className="card-footer">Mulai menghitung <IconArrow style={{ width: 16, height: 16 }} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Panduan terbaru</span><h2>Ilmu yang bisa dipegang</h2></div>
            <Link className="text-link" href="/panduan">Lihat semua panduan <IconArrow style={{ width: 14, height: 14, display: 'inline' }} /></Link>
          </div>
          <div className="grid-3">
            {latest.slice(0, 3).map((guide) => (
              <Link key={guide.id} href={`/panduan/${guide.slug}`} className="card card-hover">
                <span className="tag">{guide.category.replace('-', ' ')}</span>
                <h3>{guide.title}</h3><p>{guide.summary}</p>
                <div className="card-footer">
                  <span>{formatDate(guide.updatedAt)}</span>
                  {guide.fieldVerified && <VerifiedSeal when={guide.verifiedAt} />}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Komoditas</span><h2>Mulai dari tanaman Anda</h2></div>
            <Link className="text-link" href="/komoditas">Semua komoditas <IconArrow style={{ width: 14, height: 14, display: 'inline' }} /></Link>
          </div>
          <div className="grid-3">
            {commodities.slice(0, 6).map((crop) => (
              <Link key={crop.id} href={`/komoditas/${crop.slug}`} className="card card-hover" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span className="commodity-swatch" style={{ background: crop.accent }}>{crop.name.charAt(0)}</span>
                <div><h3 style={{ fontSize: 18, marginTop: 2 }}>{crop.name}</h3><p className="small">{crop.summary}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 48, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', background: 'var(--primary-container)' }}>
            <div>
              <span className="eyebrow">Diagnosa gejala</span>
              <h2 style={{ fontSize: 34, marginTop: 8 }}>Tanaman bermasalah?</h2>
              <p className="muted" style={{ marginTop: 8, maxWidth: '52ch' }}>Jawab beberapa pertanyaan singkat untuk melihat kemungkinan penyebabnya. Hasilnya kemungkinan, bukan kepastian.</p>
            </div>
            <Link className="btn btn-primary" href="/app/diagnosa"><IconDiagnose style={{ width: 18, height: 18 }} /> Mulai diagnosa</Link>
          </div>
        </div>
      </section>
    </>
  );
}

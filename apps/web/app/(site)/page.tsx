import Link from 'next/link';
import {
  activeEntries, activityLabels, calendarEntries, commodities, formatDate, guides, seasonForMonth,
  seasonLabels, seasonMessage, site, tools, zones,
} from '@sabditani/core';
import { ContourBackdrop } from '@/components/ContourBackdrop';
import { CropIcon } from '@/components/CropIcon';
import { VerifiedSeal } from '@/components/VerifiedSeal';
import {
  IconArrow, IconCalculator, IconCalendar, IconDiagnose, IconExternal,
  IconHome, IconLeaf, IconSeal,
} from '@/components/Icons';

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

      <section className="hero home-hero">
        <ContourBackdrop />
        <div className="container hero-inner">
          <div className="home-hero-copy">
            <span className="season-pill reveal reveal-1"><span className="dot" /> {seasonLabels[season]} · {zone.name}</span>
            <h1 className="reveal reveal-2">Hari ini <em>di lahan</em></h1>
            <p className="lead reveal reveal-3">{seasonMessage(season)} Lihat apa yang sebaiknya Anda kerjakan sekarang, lalu hitung kebutuhannya dengan alat yang jelas asumsinya.</p>
            <div className="hero-actions reveal reveal-4">
              <Link className="btn btn-primary home-hero-primary" href="/app">Lihat yang cocok ditanam sekarang <IconArrow /></Link>
              <Link className="btn btn-secondary home-hero-secondary" href="/panduan">Baca panduan</Link>
            </div>
            <div className="trust-row reveal reveal-5">
              <span><IconSeal /> Ditulis & diperiksa</span>
              <span><IconCalculator /> Asumsi ditampilkan</span>
              <span><IconLeaf /> Tanpa janji panen</span>
            </div>
            <p className="home-trust-note reveal reveal-5">{formatDate(now)} · Panduan pertanian berbahasa Indonesia</p>
          </div>

          <aside className="hero-card reveal reveal-3" aria-label="Ringkasan kegiatan bulan ini">
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
            <Link className="text-link home-hero-card-link" href="/app/kalender?komoditas=cabai&wilayah=jawa-rendah">
              Buka Kalender Tanam <IconArrow />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section home-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Empat pilar</span><h2>Dari pertanyaan menjadi keputusan</h2></div>
            <p className="muted small home-section-intro">Setiap bagian menjawab satu pertanyaan yang sering muncul sebelum Anda bertindak di lahan.</p>
          </div>
          <div className="grid-3">
            <Link href="/app" className="card card-hover home-pillar">
              <span className="home-pillar-icon"><IconHome /></span>
              <span className="card-kicker">01 · Hari ini</span>
              <h3>Apa yang dikerjakan sekarang?</h3>
              <p>Beranda kontekstual mengikuti bulan, musim, dan wilayah pilihan Anda.</p>
              <span className="card-footer">Buka beranda <IconArrow /></span>
            </Link>
            <Link href="/app/kalender" className="card card-hover home-pillar">
              <span className="home-pillar-icon"><IconCalendar /></span>
              <span className="card-kicker">02 · Kalender</span>
              <h3>Kapan waktu tanamnya?</h3>
              <p>Garis waktu 12 bulan untuk semai, tanam, pupuk, dan panen.</p>
              <span className="card-footer"><IconCalendar /> Lihat kalender</span>
            </Link>
            <Link href="/app/alat" className="card card-hover home-pillar">
              <span className="home-pillar-icon"><IconCalculator /></span>
              <span className="card-kicker">03 · Hitung</span>
              <h3>Berapa kebutuhannya?</h3>
              <p>Dosis pupuk, populasi tanam, dan analisis usaha dengan angka langsung.</p>
              <span className="card-footer"><IconCalculator /> Buka alat hitung</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-section home-section--tint">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Alat cepat</span><h2>Hitung sebelum Anda membeli</h2></div>
            <Link className="btn btn-secondary btn-small" href="/app/alat">Semua alat <IconExternal /></Link>
          </div>
          <div className="grid-3">
            {tools.map((tool, index) => (
              <Link key={tool.slug} href={`/app/alat/${tool.slug}`} className="card card-hover home-tool">
                <span className="card-kicker">Alat 0{index + 1}</span>
                <h3>{tool.name}</h3>
                <p>{tool.summary}</p>
                <span className="card-footer">Mulai menghitung <IconArrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Panduan terbaru</span><h2>Ilmu yang bisa dipegang</h2></div>
          </div>
          <div className="grid-3">
            {latest.slice(0, 3).map((guide) => (
              <Link key={guide.id} href={`/panduan/${guide.slug}`} className="card card-hover home-guide" aria-label={`Baca ${guide.title}`}>
                <span className="tag">{guide.category.replace('-', ' ')}</span>
                <h3>{guide.title}</h3>
                <p>{guide.summary}</p>
                <span className="card-footer home-guide-footer">
                  <span>{formatDate(guide.updatedAt)}</span>
                  {guide.fieldVerified && <VerifiedSeal when={guide.verifiedAt} />}
                  <IconArrow className="home-read-arrow" />
                  <span className="sr-only">Baca</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="home-section-action">
            <Link className="btn btn-secondary" href="/panduan">Lihat semua panduan <IconArrow /></Link>
          </div>
        </div>
      </section>

      <section className="section home-section home-section--tint">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Komoditas</span><h2>Mulai dari tanaman Anda</h2></div>
            <Link className="btn btn-secondary btn-small" href="/komoditas">Semua komoditas <IconArrow /></Link>
          </div>
          <div className="grid-3">
            {commodities.slice(0, 6).map((crop) => (
              <Link key={crop.id} href={`/komoditas/${crop.slug}`} className="card card-hover home-crop">
                <CropIcon slug={crop.slug} />
                <h3>{crop.name}</h3>
                <p>{crop.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-section">
        <div className="container">
          <div className="card home-diagnose">
            <div className="home-diagnose-copy">
              <span className="eyebrow">Diagnosa gejala</span>
              <h2>Tanaman bermasalah?</h2>
              <p className="muted">Jawab beberapa pertanyaan singkat untuk melihat kemungkinan penyebabnya. <span className="home-diagnose-note">Hasilnya kemungkinan, bukan kepastian.</span></p>
            </div>
            <Link className="btn btn-primary" href="/app/diagnosa"><IconDiagnose /> Mulai diagnosa</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContourBackdrop } from '@/components/ContourBackdrop';
import { site } from '@sabditani/core';

export const metadata: Metadata = { title: 'Tentang', description: 'Tentang SABDITANI, sarana abdi tani.' };

export default function TentangPage() {
  return (
    <>
      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <ContourBackdrop animated={false} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Tentang</span></div>
          <span className="eyebrow">Tentang kami</span><h1>{site.name}</h1><p>{site.tagline} — kabar dan ilmu tani yang bisa dipercaya.</p>
        </div>
      </header>
      <div className="container-narrow" style={{ padding: '64px 0 96px' }}>
        <div className="article">
          <h2>Kenapa kami ada</h2>
          <p>Informasi pertanian mudah ditemukan, tetapi tidak selalu jelas siapa penulisnya, kapan diperbarui, dan apakah sudah dicoba di lahan. SABDITANI menyusun panduan dengan tiga janji: penulis yang disebut, tanggal yang terbuka, dan penanda verifikasi lapangan bila memang sudah diperiksa.</p>
          <h2>Arti nama</h2>
          <p><strong>Sabda</strong> berarti ucapan yang berbobot dan bisa dipegang. <strong>Tani</strong> mengingatkan pada kerja nyata di lahan. Bersama, <strong>SABDITANI — sarana abdi tani</strong> berarti sarana untuk mengabdi kepada dunia tani.</p>
          <h2>Yang kami kerjakan</h2>
          <ul>
            <li><strong>Hari Ini</strong> — menunjukkan pekerjaan yang sesuai dengan bulan dan wilayah.</li>
            <li><strong>Kalender Tanam</strong> — merangkum jendela semai, tanam, pupuk, dan panen.</li>
            <li><strong>Alat Hitung</strong> — menghitung kebutuhan dan biaya dengan asumsi yang terbuka.</li>
            <li><strong>Pelajari</strong> — panduan terverifikasi yang bisa dibaca dan dibagikan.</li>
            <li><strong>Selamatkan</strong> — diagnosa gejala berbasis aturan, bukan janji kepastian.</li>
          </ul>
          <h2>Batas tanggung jawab</h2>
          <p>Semua dosis, harga, dan jendela waktu adalah panduan umum. Ikuti anjuran penyuluh setempat dan label produk resmi sebelum mengambil keputusan di lahan.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
          <Link className="btn btn-primary" href="/metodologi">Baca metodologi</Link>
          <Link className="btn btn-secondary" href="/kontak">Hubungi kami</Link>
        </div>
      </div>
    </>
  );
}

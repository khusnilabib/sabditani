import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Metodologi', description: 'Bagaimana SABDITANI menyusun, memeriksa, dan memperbarui panduan pertanian.' };

export default function MethodPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Metodologi</span></div>
          <span className="eyebrow">E-E-A-T</span><h1>Metodologi</h1>
          <p>Kami membuka cara kerja agar Anda bisa menilai sendiri seberapa jauh sebuah panduan bisa dipercaya.</p>
        </div>
      </header>
      <div className="container-narrow" style={{ padding: '56px 0 96px' }}>
        <div className="article">
          <h2>1. Sumber dan penulis</h2>
          <p>Setiap panduan mencantumkan nama penulis atau penyuluh. Sumber yang dipakai dicatat, baik berupa pengalaman lapangan, buku, maupun rujukan resmi pemerintah. Kami tidak memakai foto stok sebagai bukti lapangan.</p>
          <h2>2. Penanda terverifikasi lapangan</h2>
          <p>Cap <strong>Terverifikasi Lapangan</strong> hanya dipasang bila panduan atau data benar-benar diperiksa langsung di kebun atau sawah. Cap disertai nama pemeriksa dan bulan pemeriksaan.</p>
          <h2>3. Angka dan asumsi</h2>
          <p>Setiap hasil hitung menampilkan asumsi yang dipakai: luas lahan, dosis, jarak tanam, harga, dan daya kecambah. Angka disebut panduan umum, bukan janji hasil panen.</p>
          <h2>4. Kalender tanam</h2>
          <p>Jendela waktu disusun per komoditas dan wilayah. Pembagian musim bersifat indikatif dari bulan hujan wilayah dan tidak menggantikan data cuaca resmi BMKG atau pengetahuan penyuluh setempat.</p>
          <h2>5. Diagnosa gejala</h2>
          <p>Diagnosa memakai aturan kecocokan gejala, bukan kecerdasan buatan. Hasilnya diurutkan sebagai kemungkinan dan selalu disertai anjuran untuk memastikan dengan petugas setempat.</p>
          <h2>6. Pembaruan</h2>
          <p>Panduan diberi tanggal terbit dan tanggal diperbarui. Perubahan data kalender memicu pembangunan ulang snapshot agar aplikasi web menunjukkan angka terbaru.</p>
          <h2>7. Keselamatan</h2>
          <p>Konten pestisida dan dosis memuat peringatan penggunaan APD serta urutan pengendalian: budidaya, hayati, lalu kimia bila diperlukan.</p>
        </div>
      </div>
    </>
  );
}

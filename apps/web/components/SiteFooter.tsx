import Link from 'next/link';
import { site } from '@sabditani/core';
import { BrandMark } from './BrandMark';
import { IconWhatsapp } from './Icons';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-inner">
          <div>
            <BrandMark />
            <p className="muted small" style={{ marginTop: 16, maxWidth: '34ch' }}>
              Kabar dan ilmu tani yang bisa dipercaya. Panduan disusun dan diperiksa oleh penulis serta penyuluh lapangan.
            </p>
            <a className="btn btn-secondary btn-small" style={{ marginTop: 16 }} href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <IconWhatsapp style={{ width: 16, height: 16 }} /> Hubungi kami
            </a>
          </div>
          <div>
            <h4>Jelajahi</h4>
            <ul>
              <li><Link href="/panduan">Panduan</Link></li>
              <li><Link href="/komoditas">Komoditas</Link></li>
              <li><Link href="/hama">Hama & Penyakit</Link></li>
              <li><Link href="/app/kalender">Kalender Tanam</Link></li>
            </ul>
          </div>
          <div>
            <h4>Alat</h4>
            <ul>
              <li><Link href="/app/alat/pupuk">Hitung Pupuk</Link></li>
              <li><Link href="/app/alat/populasi">Populasi Tanam</Link></li>
              <li><Link href="/app/alat/usaha">Analisis Usaha</Link></li>
              <li><Link href="/app/diagnosa">Diagnosa Gejala</Link></li>
            </ul>
          </div>
          <div>
            <h4>Tentang</h4>
            <ul>
              <li><Link href="/tentang">Tentang SABDITANI</Link></li>
              <li><Link href="/metodologi">Metodologi</Link></li>
              <li><Link href="/kontak">Kontak</Link></li>
              <li><Link href="/privasi">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} SABDITANI — sarana abdi tani.</span>
          <span>Angka dalam alat hitung adalah panduan umum, bukan janji hasil panen.</span>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@sabditani/core';
import { IconWhatsapp, IconExternal } from '@/components/Icons';

export const metadata: Metadata = { title: 'Kontak', description: 'Hubungi tim SABDITANI untuk pertanyaan, koreksi panduan, atau kerja sama.' };

export default function ContactPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Kontak</span></div>
          <span className="eyebrow">Hubungi kami</span><h1>Kontak</h1>
          <p>Ada koreksi data, pertanyaan, atau usulan panduan? Kabari kami dengan singkat dan jelas.</p>
        </div>
      </header>
      <div className="container-narrow" style={{ padding: '56px 0 96px' }}>
        <div className="grid-2">
          <div className="card">
            <span className="card-kicker">Paling cepat</span><h3>WhatsApp</h3>
            <p>Kirim pertanyaan atau foto gejala tanaman. Kami membalas saat jam kerja.</p>
            <a className="btn btn-primary" style={{ marginTop: 16 }} href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <IconWhatsapp style={{ width: 18, height: 18 }} /> Buka WhatsApp
            </a>
          </div>
          <div className="card">
            <span className="card-kicker">Tertulis</span><h3>Email</h3>
            <p>Untuk koreksi panduan, rujukan sumber, atau kerja sama. Sertakan judul panduan bila ada.</p>
            <a className="btn btn-secondary" style={{ marginTop: 16 }} href={`mailto:${site.email}`}>
              <IconExternal style={{ width: 18, height: 18 }} /> {site.email}
            </a>
          </div>
        </div>
        <div className="notice" style={{ marginTop: 32 }}>
          Formulir kontak dengan perlindungan Turnstile disiapkan pada fase berikutnya. Untuk sekarang, gunakan WhatsApp atau email agar pesan Anda tetap sampai.
        </div>
      </div>
    </>
  );
}

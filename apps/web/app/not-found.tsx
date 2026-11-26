import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <BrandMark />
        <h1 style={{ fontSize: 40, margin: '32px 0 12px' }}>Halaman tidak ditemukan</h1>
        <p className="muted">Tautan mungkin salah atau halaman sudah dipindahkan.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link className="btn btn-primary" href="/">Kembali ke beranda</Link>
          <Link className="btn btn-secondary" href="/panduan">Cari panduan</Link>
        </div>
      </div>
    </div>
  );
}

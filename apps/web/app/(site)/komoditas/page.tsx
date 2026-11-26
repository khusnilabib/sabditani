import type { Metadata } from 'next';
import Link from 'next/link';
import { commodities } from '@sabditani/core';

export const metadata: Metadata = { title: 'Komoditas', description: 'Profil komoditas pertanian beserta ringkasan kalender dan panduan terkait.' };

export default function CommoditiesPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Komoditas</span></div>
          <span className="eyebrow">Profil tanaman</span><h1>Komoditas</h1>
          <p>Pilih tanaman untuk melihat kalender tanam, kebutuhan benih, serta panduan yang relevan.</p>
        </div>
      </header>
      <div className="container" style={{ padding: '48px 0 96px' }}>
        <div className="grid-3">
          {commodities.map((crop) => (
            <Link key={crop.id} href={`/komoditas/${crop.slug}`} className="card card-hover">
              <span className="commodity-swatch" style={{ background: crop.accent }}>{crop.name.charAt(0)}</span>
              <h3 style={{ marginTop: 16 }}>{crop.name}</h3>
              <p>{crop.summary}</p>
              <div className="card-footer"><span className="tag">{crop.group}</span><span>Lihat profil →</span></div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

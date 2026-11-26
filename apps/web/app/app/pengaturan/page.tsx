'use client';

import { seasonLabels, zones, type Season } from '@sabditani/core';
import { useTheme } from '@/components/ThemeProvider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSaved } from '@/hooks/useSaved';

export default function SettingsPage() {
  const { mode, toggle, season, setSeason, fontScale, setFontScale } = useTheme();
  const [zoneId, setZoneId] = useLocalStorage('sd-zone', 'jawa-rendah');
  const [cropId, setCropId] = useLocalStorage('sd-crop', 'cabai');
  const { clear } = useSaved();

  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Preferensi</span><h1>Pengaturan</h1>
        <p className="muted">Semua pengaturan disimpan di perangkat Anda. Tidak perlu akun.</p>
      </div>
      <div className="grid-2">
        <div className="panel">
          <span className="panel-title">Tampilan</span>
          <div className="field">
            <label>Tema</label>
            <div className="segmented">
              <button aria-pressed={mode === 'light'} onClick={() => { if (mode === 'dark') toggle(); }}>Terang</button>
              <button aria-pressed={mode === 'dark'} onClick={() => { if (mode === 'light') toggle(); }}>Gelap</button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="season">Aksen musim</label>
            <select id="season" className="select" value={season} onChange={(e) => setSeason(e.target.value as Season)}>
              {(Object.keys(seasonLabels) as Season[]).map((value) => <option key={value} value={value}>{seasonLabels[value]}</option>)}
            </select>
            <div className="field-help">Ikuti musim wilayah Anda, atau pilih manual.</div>
          </div>
          <div className="field">
            <label htmlFor="font">Ukuran huruf: {Math.round(fontScale * 100)}%</label>
            <input id="font" type="range" min="1" max="2" step="0.1" value={fontScale} onChange={(e) => setFontScale(Number(e.target.value))} />
            <div className="field-help">Hingga 200% tanpa merusak tata letak.</div>
          </div>
        </div>
        <div className="panel">
          <span className="panel-title">Lahan & wilayah</span>
          <div className="field">
            <label htmlFor="zone">Wilayah</label>
            <select id="zone" className="select" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
              {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="crop">Komoditas utama</label>
            <select id="crop" className="select" value={cropId} onChange={(e) => setCropId(e.target.value)}>
              <option value="cabai">Cabai</option><option value="padi">Padi</option><option value="jagung">Jagung</option>
              <option value="tomat">Tomat</option><option value="bawang-merah">Bawang Merah</option><option value="kedelai">Kedelai</option>
            </select>
          </div>
          <div className="field">
            <label>Data tersimpan</label>
            <button className="btn btn-secondary btn-small" onClick={() => { if (confirm('Hapus semua hitungan tersimpan?')) clear(); }}>Hapus hitungan tersimpan</button>
            <div className="field-help">Tindakan ini tidak dapat dibatalkan.</div>
          </div>
        </div>
      </div>
      <div className="notice" style={{ marginTop: 24 }}>Pengaturan tema mengikuti sistem secara default. Pengaturan musim berubah otomatis di halaman Kalender Tanam sesuai wilayah pilihan Anda.</div>
    </>
  );
}

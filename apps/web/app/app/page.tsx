'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  activeEntries, activityLabels, calendarEntries, commodities, guides, pests, seasonForMonth,
  seasonLabels, seasonMessage, zones,
} from '@sabditani/core';
import { ContourBackdrop } from '@/components/ContourBackdrop';
import { IconArrow, IconBookmark, IconCalculator, IconCalendar, IconDiagnose, IconExternal } from '@/components/Icons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/components/ThemeProvider';

const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

export default function TodayPage() {
  const [zoneId, setZoneId] = useLocalStorage('sd-zone', 'jawa-rendah');
  const [cropId, setCropId] = useLocalStorage('sd-crop', 'cabai');
  const { setSeason } = useTheme();
  const [month] = useState(() => new Date().getMonth() + 1);
  const zone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const crop = commodities.find((c) => c.id === cropId) ?? commodities[0];
  const season = seasonForMonth(zone.rainyMonths, month);
  const active = activeEntries(calendarEntries, crop.id, zone.id, month);
  const latest = guides.slice(0, 3);

  useEffect(() => { setSeason(season); }, [season, setSeason]);

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: 32, background: 'var(--surface)' }}>
        <ContourBackdrop />
        <div style={{ position: 'relative' }}>
          <span className="season-pill"><span className="dot" /> {seasonLabels[season]} · {monthNames[month - 1]}</span>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', margin: '18px 0 12px' }}>Hari ini di lahan</h1>
          <p className="lead">{seasonMessage(season)}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28, alignItems: 'end' }}>
            <div className="field" style={{ margin: 0, minWidth: 210 }}>
              <label htmlFor="zone">Wilayah</label>
              <select id="zone" className="select" value={zone.id} onChange={(e) => setZoneId(e.target.value)}>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0, minWidth: 180 }}>
              <label htmlFor="crop">Komoditas</label>
              <select id="crop" className="select" value={crop.id} onChange={(e) => setCropId(e.target.value)}>
                {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Link className="btn btn-primary" href={`/app/kalender?komoditas=${crop.id}&wilayah=${zone.id}`}>
              Lihat yang cocok ditanam sekarang <IconArrow style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 48 }}>
        <div className="section-head"><div><span className="eyebrow">Sedang waktunya</span><h2 style={{ fontSize: 26 }}>Pekerjaan bulan ini</h2></div></div>
        {active.length ? (
          <div className="grid-3">
            {active.map((entry) => (
              <Link key={entry.id} href={`/app/kalender?komoditas=${crop.id}&wilayah=${zone.id}`} className="card card-hover">
                <span className="tag">{activityLabels[entry.activity]}</span>
                <h3 style={{ fontSize: 20, marginTop: 12 }}>{crop.name} · {activityLabels[entry.activity]}</h3>
                <p>{entry.note}</p>
                <div className="card-footer">Lihat rincian <IconArrow style={{ width: 16, height: 16 }} /></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Belum ada jendela aktif</h3>
            <p className="muted">Coba pilih komoditas atau wilayah lain di Kalender Tanam.</p>
            <Link className="btn btn-primary btn-small" style={{ marginTop: 16 }} href="/app/kalender">Buka kalender</Link>
          </div>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <div className="section-head"><div><span className="eyebrow">Alat cepat</span><h2 style={{ fontSize: 26 }}>Hitung kebutuhan Anda</h2></div><Link className="text-link" href="/app/alat">Semua alat</Link></div>
        <div className="grid-3">
          {[
            { href: `/app/alat/pupuk?komoditas=${crop.id}`, title: 'Hitung Pupuk', desc: 'Dosis dan biaya per aplikasi', icon: IconCalculator },
            { href: '/app/alat/populasi', title: 'Populasi Tanam', desc: 'Jumlah tanaman dan benih', icon: IconCalendar },
            { href: '/app/alat/usaha', title: 'Analisis Usaha', desc: 'Laba, R/C, dan titik impas', icon: IconDiagnose },
          ].map(({ href, title, desc, icon: Icon }) => (
            <Link key={href} href={href} className="card card-hover">
              <Icon style={{ width: 24, height: 24, color: 'var(--primary)' }} />
              <h3 style={{ fontSize: 20, marginTop: 12 }}>{title}</h3><p>{desc}</p>
              <div className="card-footer">Mulai <IconArrow style={{ width: 16, height: 16 }} /></div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid-2" style={{ marginTop: 48 }}>
        <div className="panel">
          <span className="panel-title">Waspada musim ini</span>
          {pests.slice(0, 3).map((pest) => (
            <Link key={pest.id} href={`/hama/${pest.slug}`} style={{ display: 'block', padding: '12px 0', borderBottom: '1px dashed var(--line)' }}>
              <strong style={{ fontSize: 15 }}>{pest.name}</strong>
              <p className="muted small">{pest.summary}</p>
            </Link>
          ))}
        </div>
        <div className="panel">
          <span className="panel-title">Panduan terbaru ↗</span>
          {latest.map((guide) => (
            <Link key={guide.id} href={`/panduan/${guide.slug}`} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed var(--line)' }}>
              <IconExternal style={{ width: 16, height: 16, color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>{guide.title}</span>
            </Link>
          ))}
          <Link className="text-link" style={{ display: 'inline-block', marginTop: 16 }} href={`/app/tersimpan`}><IconBookmark style={{ width: 14, height: 14, display: 'inline' }} /> Lihat tersimpan</Link>
        </div>
      </div>
    </>
  );
}

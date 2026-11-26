'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  activeEntries, activityLabels, calendarEntries, commodities, isWindowActive, monthNames, monthShort,
  seasonForMonth, zones, type Activity, type CalendarEntry,
} from '@sabditani/core';
import { IconArrow, IconCalendar, IconCheck, IconCopy, IconDownload, IconExternal, IconShare } from '@/components/Icons';
import { useCopy } from '@/hooks/useCopy';
import { useTheme } from '@/components/ThemeProvider';

const activities: Activity[] = ['semai', 'olah_lahan', 'tanam', 'pemupukan', 'panen', 'pascapanen'];

export function CalendarClient({ initialCrop, initialZone }: { initialCrop?: string; initialZone?: string }) {
  const [cropId, setCropId] = useState(initialCrop ?? 'cabai');
  const [zoneId, setZoneId] = useState(initialZone ?? 'jawa-rendah');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [filter, setFilter] = useState<Activity | 'semua'>('semua');
  const [detail, setDetail] = useState<{ entry: CalendarEntry; month: number } | null>(null);
  const { copied, copy } = useCopy();
  const { setSeason } = useTheme();

  const zone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const crop = commodities.find((c) => c.id === cropId) ?? commodities[0];
  const season = seasonForMonth(zone.rainyMonths, selectedMonth);

  useEffect(() => { setSeason(season); }, [season, setSeason]);

  useEffect(() => {
    const params = new URLSearchParams({ komoditas: cropId, wilayah: zoneId });
    window.history.replaceState(null, '', `/app/kalender?${params.toString()}`);
  }, [cropId, zoneId]);

  const rows = useMemo(() => activities
    .filter((activity) => filter === 'semua' || filter === activity)
    .map((activity) => ({
      activity,
      entries: calendarEntries.filter((entry) => entry.commodityId === cropId && entry.zoneId === zoneId && entry.activity === activity),
    })), [cropId, zoneId, filter]);

  const monthActive = activeEntries(calendarEntries, cropId, zoneId, selectedMonth);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/app/kalender?komoditas=${cropId}&wilayah=${zoneId}` : '';

  const downloadReminder = () => {
    if (!detail) return;
    const now = new Date();
    const startYear = now.getFullYear();
    const endYear = detail.entry.endMonth < detail.entry.startMonth ? startYear + 1 : startYear;
    const pad = (n: number) => String(n).padStart(2, '0');
    const dtstart = `${startYear}${pad(detail.entry.startMonth)}01`;
    const endMonth = detail.entry.endMonth === 12 ? 1 : detail.entry.endMonth + 1;
    const dtend = `${endYear + (detail.entry.endMonth === 12 ? 1 : 0)}${pad(endMonth)}01`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SABDITANI//Kalender Tanam//ID', 'BEGIN:VEVENT',
      `UID:${detail.entry.id}-${startYear}@sabditani.id`, `DTSTAMP:${startYear}0101T000000Z`,
      `DTSTART;VALUE=DATE:${dtstart}`, `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${crop.name} — ${activityLabels[detail.entry.activity]}`,
      `DESCRIPTION:${detail.entry.note.replace(/;/g, '\\;').replace(/,/g, '\\,')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sabditani-${crop.slug}-${detail.entry.activity}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Kalender tanam</span>
        <h1>Kalender Tanam</h1>
        <p className="muted">Geser atau pilih bulan, lalu ketuk batang kegiatan untuk melihat rincian. Jendela boleh melintasi pergantian tahun.</p>
      </div>

      <div className="calendar-controls">
        <div className="field"><label htmlFor="crop">Komoditas</label>
          <select id="crop" className="select" value={cropId} onChange={(e) => { setCropId(e.target.value); setDetail(null); }}>
            {commodities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="zone">Wilayah</label>
          <select id="zone" className="select" value={zoneId} onChange={(e) => { setZoneId(e.target.value); setDetail(null); }}>
            {zones.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="filter">Filter kegiatan</label>
          <select id="filter" className="select" value={filter} onChange={(e) => setFilter(e.target.value as Activity | 'semua')}>
            <option value="semua">Semua kegiatan</option>
            {activities.map((activity) => <option key={activity} value={activity}>{activityLabels[activity]}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary btn-small" onClick={() => copy(shareUrl)}>
          {copied ? <IconCheck style={{ width: 16, height: 16 }} /> : <IconShare style={{ width: 16, height: 16 }} />}
          {copied ? 'Tautan tersalin' : 'Bagikan'}
        </button>
      </div>

      <div className="calendar-scroll">
        <div className="calendar-grid" tabIndex={0} aria-label="Kalender 12 bulan. Gunakan tombol panah untuk berpindah bulan."
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); setSelectedMonth((m) => m === 12 ? 1 : m + 1); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); setSelectedMonth((m) => m === 1 ? 12 : m - 1); }
          }}
        >
          <div className="calendar-head">
            <span className="corner">Kegiatan</span>
            {monthShort.map((label, index) => <span key={label} className={index + 1 === selectedMonth ? 'today-marker' : ''}>{label}</span>)}
          </div>
          <div className="calendar-row">
            <div className="row-label">Hari ini</div>
            {monthShort.map((_, index) => (
              <div key={index} className="calendar-cell" style={{ background: 'transparent', boxShadow: 'none' }}>
                {new Date().getMonth() + 1 === index + 1 ? <span className="today-marker">▲</span> : null}
              </div>
            ))}
          </div>
          {rows.map(({ activity, entries }) => (
            <div className="calendar-row" key={activity}>
              <div className="row-label">{activityLabels[activity]}</div>
              {monthShort.map((_, index) => {
                const month = index + 1;
                const active = entries.filter((entry) => isWindowActive(month, entry.startMonth, entry.endMonth));
                return (
                  <div key={month} className={`calendar-cell${month === selectedMonth ? ' current' : ''}`}>
                    {active.map((entry) => (
                      <button
                        key={entry.id}
                        className={`calendar-bar ${activity}${detail?.entry.id === entry.id && detail.month === month ? ' selected' : ''}`}
                        onClick={() => { setSelectedMonth(month); setDetail({ entry, month }); }}
                        aria-label={`${activityLabels[activity]} ${monthNames[month - 1]}. ${entry.note}`}
                        title={entry.note}
                      >
                        {entry.startMonth === month ? activityLabels[activity].slice(0, 4) : ''}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        {activities.map((activity) => <span key={activity}><i className={`calendar-bar ${activity}`} style={{ width: 12, height: 12 }} /> {activityLabels[activity]}</span>)}
        <span><i style={{ width: 12, height: 12, border: '2px solid var(--accent)' }} /> Bulan dipilih</span>
      </div>

      <div className="panel calendar-detail" style={{ marginTop: 28 }}>
        <span className="eyebrow">{monthNames[selectedMonth - 1]} · {zone.name}</span>
        <h3 style={{ fontSize: 24, margin: '8px 0' }}>{detail ? `${crop.name} · ${activityLabels[detail.entry.activity]}` : `Apa yang cocok di ${monthNames[selectedMonth - 1]}?`}</h3>
        {detail ? (
          <>
            <p className="muted">{detail.entry.note}</p>
            <p className="small muted" style={{ marginTop: 12 }}>Catatan lapangan bersifat indikatif. Sesuaikan dengan kondisi lahan dan anjuran penyuluh setempat.</p>
            <div className="action-row">
              <button className="btn btn-secondary btn-small" onClick={downloadReminder}><IconDownload style={{ width: 16, height: 16 }} /> Tambah pengingat (.ics)</button>
              <Link className="btn btn-secondary btn-small" href="/panduan"><IconExternal style={{ width: 16, height: 16 }} /> Buka panduan</Link>
              <button className="btn btn-secondary btn-small" onClick={() => copy(shareUrl)}><IconCopy style={{ width: 16, height: 16 }} /> Salin tautan</button>
            </div>
          </>
        ) : (
          <>
            <p className="muted">{monthActive.length ? `${monthActive.length} kegiatan aktif untuk ${crop.name} di ${zone.name} pada bulan ini.` : 'Belum ada kegiatan tercatat untuk kombinasi ini.'}</p>
            <p className="small muted" style={{ marginTop: 8 }}>Ketuk batang pada kalender untuk melihat catatan lapangan, mengunduh pengingat, atau menyalin tautan.</p>
          </>
        )}
      </div>
      <div className="notice" style={{ marginTop: 20 }}>
        <IconCalendar style={{ width: 16, height: 16, display: 'inline', verticalAlign: '-3px' }} /> Data kalender berasal dari snapshot statis yang diperbarui saat build. Perubahan jadwal dari aplikasi admin akan tampil setelah proses build selesai.
      </div>
    </>
  );
}

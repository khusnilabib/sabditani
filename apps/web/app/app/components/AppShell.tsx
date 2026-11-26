'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/BrandMark';
import { Drawer } from '@/components/Drawer';
import { SearchLauncher } from '@/components/SearchLauncher';
import {
  IconArrow, IconBook, IconBookmark, IconCalculator, IconCalendar, IconDiagnose,
  IconExternal, IconGrid, IconHome, IconMenu, IconMoon, IconSettings, IconSprout, IconSun,
} from '@/components/Icons';
import { useTheme } from '@/components/ThemeProvider';
import { formatDate } from '@sabditani/core';

type NavItem = { href: string; label: string; icon: typeof IconHome };
const groups: { label: string; icon: typeof IconHome; items: NavItem[] }[] = [
  {
    label: 'Rutinitas', icon: IconSprout,
    items: [
      { href: '/app', label: 'Hari Ini', icon: IconHome },
      { href: '/app/kalender', label: 'Kalender Tanam', icon: IconCalendar },
      { href: '/app/tersimpan', label: 'Tersimpan', icon: IconBookmark },
    ],
  },
  {
    label: 'Alat hitung', icon: IconCalculator,
    items: [
      { href: '/app/alat/pupuk', label: 'Hitung Pupuk', icon: IconCalculator },
      { href: '/app/alat/populasi', label: 'Populasi Tanam', icon: IconCalculator },
      { href: '/app/alat/usaha', label: 'Analisis Usaha', icon: IconCalculator },
    ],
  },
  {
    label: 'Rujukan lapangan', icon: IconBook,
    items: [
      { href: '/app/diagnosa', label: 'Diagnosa Gejala', icon: IconDiagnose },
      { href: '/panduan', label: 'Panduan ↗', icon: IconBook },
      { href: '/komoditas', label: 'Komoditas ↗', icon: IconSprout },
    ],
  },
  {
    label: 'Preferensi', icon: IconSettings,
    items: [{ href: '/app/pengaturan', label: 'Pengaturan', icon: IconSettings }],
  },
];

const quick: NavItem[] = [
  { href: '/app', label: 'Hari Ini', icon: IconHome },
  { href: '/app/kalender', label: 'Kalender', icon: IconCalendar },
  { href: '/app/alat', label: 'Alat', icon: IconCalculator },
];

const pageTitles: Record<string, string> = {
  '/app': 'Hari Ini',
  '/app/kalender': 'Kalender Tanam',
  '/app/alat': 'Alat Hitung',
  '/app/alat/pupuk': 'Hitung Pupuk',
  '/app/alat/populasi': 'Populasi Tanam',
  '/app/alat/usaha': 'Analisis Usaha',
  '/app/cari': 'Pencarian',
  '/app/diagnosa': 'Diagnosa Gejala',
  '/app/tersimpan': 'Tersimpan',
  '/app/pengaturan': 'Pengaturan',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => href === '/app' ? pathname === '/app' : pathname === href || pathname.startsWith(`${href}/`);
  const pageTitle = pageTitles[pathname] ?? 'Ruang Kerja';

  const navList = (items: NavItem[], onNavigate?: () => void) => (
    <>
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`app-nav-link${isActive(href) ? ' active' : ''}`} aria-current={isActive(href) ? 'page' : undefined} onClick={onNavigate}>
          <Icon /><span>{label.replace(' ↗', '')}</span>{label.includes('↗') && <IconExternal style={{ width: 14, height: 14, marginLeft: 'auto', opacity: .6 }} />}
        </Link>
      ))}
    </>
  );

  return (
    <div className="app-shell">
      {/* Sidebar khusus ruang kerja: berbeda dari menu situs publik. */}
      <aside className="app-rail" aria-label="Sidebar aplikasi">
        <div className="app-rail-top">
          <BrandMark href="/app" />
          <p className="app-rail-caption">Ruang kerja pertanian Anda</p>
        </div>
        <nav className="app-nav" aria-label="Navigasi aplikasi">
          {groups.map(({ label, icon: Icon, items }) => (
            <div className="app-nav-group" key={label}>
              <span className="app-nav-label"><Icon style={{ width: 14, height: 14 }} /> {label}</span>
              {navList(items)}
            </div>
          ))}
        </nav>
        <div className="app-rail-footer">
          <span className="live-dot" /> Data snapshot: {formatDate(new Date())}
          <Link href="/" className="app-rail-site"><IconExternal style={{ width: 14, height: 14 }} /> Kembali ke situs</Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <span className="mobile-only"><BrandMark href="/app" /></span>
            <div className="app-topbar-context">
              <span className="app-topbar-eyebrow">SABDITANI · APLIKASI</span>
              <span className="app-topbar-title">{pageTitle}</span>
            </div>
            <span className="app-topbar-date muted small">{formatDate(new Date())}</span>
          </div>
          <div className="app-topbar-actions">
            <SearchLauncher variant="app" />
            <button className="icon-btn app-theme" onClick={toggle} aria-label={mode === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}>
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <Link className="btn btn-ghost btn-small app-site-link" href="/" aria-label="Buka situs SABDITANI">
              <span className="app-site-label">Situs ↗</span>
              <IconExternal className="app-site-icon" />
            </Link>
            <button type="button" className="app-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Buka menu aplikasi" aria-expanded={menuOpen} aria-controls="app-menu">
              <IconMenu /><span>Menu</span>
            </button>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi bawah aplikasi">
        {quick.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) || (href === '/app/alat' && pathname.startsWith('/app/alat/')) ? 'active' : ''} aria-current={isActive(href) ? 'page' : undefined}>
            <Icon /><span>{label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Buka menu lengkap" aria-expanded={menuOpen} aria-controls="app-menu">
          <IconGrid /><span>Menu</span>
        </button>
      </nav>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu aplikasi SABDITANI" variant="app">
        <div id="app-menu" className="drawer-content drawer-content--app">
          <div className="app-drawer-head">
            <BrandMark href="/app" inverse />
            <span className="app-drawer-kicker"><IconGrid style={{ width: 14, height: 14 }} /> Menu aplikasi</span>
            <h2>{pageTitle}</h2>
            <p>Semua halaman tersusun berdasarkan kebutuhan Anda di lahan.</p>
          </div>
          <nav className="drawer-groups" aria-label="Menu aplikasi">
            {groups.map(({ label, icon: Icon, items }) => (
              <div className="drawer-group" key={label}>
                <span className="drawer-group-label"><Icon style={{ width: 16, height: 16 }} /> {label}</span>
                {navList(items, () => setMenuOpen(false))}
              </div>
            ))}
          </nav>
          <div className="drawer-foot">
            <button type="button" className="drawer-theme" onClick={toggle} aria-pressed={mode === 'dark'}>
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
              {mode === 'dark' ? 'Tampilan terang' : 'Tampilan gelap'}
            </button>
            <Link href="/" className="drawer-site-link"><IconExternal style={{ width: 16, height: 16 }} /> Kembali ke situs SABDITANI <IconArrow style={{ width: 16, height: 16, marginLeft: 'auto' }} /></Link>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

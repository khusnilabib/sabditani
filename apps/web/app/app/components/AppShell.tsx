'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/BrandMark';
import { SearchLauncher } from '@/components/SearchLauncher';
import { IconBookmark, IconCalculator, IconCalendar, IconDiagnose, IconExternal, IconHome, IconMoon, IconSun } from '@/components/Icons';
import { useTheme } from '@/components/ThemeProvider';
import { formatDate } from '@sabditani/core';

const nav = [
  { href: '/app', label: 'Hari Ini', icon: IconHome },
  { href: '/app/kalender', label: 'Kalender', icon: IconCalendar },
  { href: '/app/alat', label: 'Alat Hitung', icon: IconCalculator },
  { href: '/app/diagnosa', label: 'Diagnosa', icon: IconDiagnose },
  { href: '/app/tersimpan', label: 'Tersimpan', icon: IconBookmark },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode, toggle } = useTheme();
  const isActive = (href: string) => href === '/app' ? pathname === '/app' : pathname.startsWith(href);

  return (
    <div className="app-shell">
      <aside className="app-rail">
        <BrandMark href="/app" />
        <nav className="app-nav" aria-label="Navigasi aplikasi">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
              <Icon /> {label}
            </Link>
          ))}
          <Link href="/panduan"><IconExternal /> Panduan ↗</Link>
        </nav>
        <div className="app-rail-footer">
          SABDITANI v0.1 · MVP<br />Snapshot data: {formatDate(new Date())}
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mobile-only"><BrandMark href="/app" compact /></span>
            <span className="muted small app-topbar-date">{formatDate(new Date())}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <SearchLauncher variant="app" />
            <button className="icon-btn" onClick={toggle} aria-label="Ganti tema">
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <Link className="btn btn-ghost btn-small app-site-link" href="/" aria-label="Buka situs SABDITANI">
              <span className="app-site-label">Situs ↗</span>
              <IconExternal className="app-site-icon" style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi bawah">
        {nav.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
            <Icon /><span>{label === 'Alat Hitung' ? 'Alat' : label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

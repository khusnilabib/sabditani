'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from './BrandMark';
import { SearchLauncher } from './SearchLauncher';
import { IconArrow, IconMoon, IconSun } from './Icons';
import { useTheme } from './ThemeProvider';

const links = [
  { href: '/panduan', label: 'Panduan' },
  { href: '/komoditas', label: 'Komoditas' },
  { href: '/hama', label: 'Hama & Penyakit' },
  { href: '/tentang', label: 'Tentang' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { mode, toggle } = useTheme();
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <BrandMark />
        <nav className="site-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <SearchLauncher />
          <button className="icon-btn" onClick={toggle} aria-label={mode === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}>
            {mode === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <Link className="btn btn-primary btn-small" href="/app">
            Buka Aplikasi <IconArrow style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}

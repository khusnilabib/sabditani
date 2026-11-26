'use client';

import { useEffect, useState } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
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
          <Link className="btn btn-primary btn-small header-cta" href="/app" aria-label="Buka aplikasi SABDITANI">
            <span className="header-cta-text">Buka Aplikasi</span>
            <span className="header-cta-short">Buka</span>
            <IconArrow style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}

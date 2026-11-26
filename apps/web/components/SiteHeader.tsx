'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from './BrandMark';
import { Drawer } from './Drawer';
import { SearchLauncher } from './SearchLauncher';
import { IconArrow, IconBook, IconCalendar, IconCalculator, IconDiagnose, IconGrid, IconMenu, IconMoon, IconSprout, IconSun } from './Icons';
import { useTheme } from './ThemeProvider';

const siteLinks = [
  { href: '/panduan', label: 'Panduan' },
  { href: '/komoditas', label: 'Komoditas' },
  { href: '/hama', label: 'Hama & Penyakit' },
  { href: '/tentang', label: 'Tentang' },
];

const drawerGroups = [
  {
    label: 'Perpustakaan tani',
    icon: IconBook,
    items: [
      { href: '/panduan', label: 'Panduan budidaya' },
      { href: '/komoditas', label: 'Profil komoditas' },
      { href: '/hama', label: 'Hama & penyakit' },
    ],
  },
  {
    label: 'Alat & aplikasi',
    icon: IconCalculator,
    items: [
      { href: '/app/kalender', label: 'Kalender tanam' },
      { href: '/app/alat/pupuk', label: 'Hitung pupuk' },
      { href: '/app/alat/usaha', label: 'Analisis usaha' },
      { href: '/app/diagnosa', label: 'Diagnosa gejala' },
    ],
  },
  {
    label: 'Tentang SABDITANI',
    icon: IconSprout,
    items: [
      { href: '/tentang', label: 'Tentang kami' },
      { href: '/metodologi', label: 'Metodologi' },
      { href: '/kontak', label: 'Kontak' },
      { href: '/privasi', label: 'Kebijakan privasi' },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { mode, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container site-header-inner">
          <BrandMark />

          <nav className="site-nav" aria-label="Navigasi utama">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={current(link.href)}>{link.label}</Link>
            ))}
          </nav>

          <div className="header-actions">
            <SearchLauncher />
            <button className="icon-btn header-theme" onClick={toggle} aria-label={mode === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}>
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <Link className="btn btn-primary btn-small header-cta" href="/app" aria-label="Buka aplikasi SABDITANI">
              <span className="header-cta-text">Buka Aplikasi</span>
              <span className="header-cta-short">Buka</span>
              <IconArrow />
            </Link>
            <button
              type="button"
              className="icon-btn header-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu situs"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu situs SABDITANI" variant="site">
        <div id="site-menu" className="drawer-content">
          <div className="drawer-intro">
            <span className="eyebrow"><IconGrid style={{ width: 14, height: 14, display: 'inline' }} /> Menu situs</span>
            <h2>Satu tempat untuk ilmu tani.</h2>
            <p className="muted small">Pilih topik, lalu lanjutkan dengan alat hitung yang sesuai.</p>
          </div>
          <nav className="drawer-groups" aria-label="Menu situs">
            {drawerGroups.map(({ label, icon: Icon, items }) => (
              <div className="drawer-group" key={label}>
                <span className="drawer-group-label"><Icon style={{ width: 16, height: 16 }} /> {label}</span>
                {items.map((item) => (
                  <Link key={item.href} href={item.href} className="drawer-link" aria-current={current(item.href)}>
                    <span>{item.label}</span><IconArrow style={{ width: 16, height: 16 }} />
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="drawer-foot">
            <button type="button" className="drawer-theme" onClick={toggle} aria-pressed={mode === 'dark'}>
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
              {mode === 'dark' ? 'Tampilan terang' : 'Tampilan gelap'}
            </button>
            <Link className="btn btn-primary drawer-cta" href="/app">
              Buka aplikasi SABDITANI <IconArrow />
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}

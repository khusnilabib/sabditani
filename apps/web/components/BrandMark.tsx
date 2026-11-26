import Link from 'next/link';

/**
 * Brand mark diturunkan dari aset logo SABDITANI (daun, tanaman, tangan, dan
 * alur sawah) lalu disederhanakan menjadi SVG vektor bermuatan token warna.
 * Hasilnya tajam di 32 px, ringan, dan mengikuti tema terang/gelap.
 */
export function BrandGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`brand-glyph ${className}`} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="46" height="46" rx="14" fill="var(--brand-tile, var(--green50))" stroke="var(--brand-edge, var(--line))" />
      <path d="M9 33.5C13.5 23 21 16.5 34.5 14c-.6 11.8-8.3 19-20.3 19.8" fill="var(--brand-leaf-soft, var(--green300))" opacity=".55" />
      <path d="M10 34c4.6-9.2 11.8-15 23-17.5" stroke="var(--brand-leaf, var(--green700))" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25.5 23.5c-.8-4 .6-7.2 3.4-9.2 1.7 3.4 1.5 6.7-3.4 9.2Z" fill="var(--brand-leaf, var(--green500))" />
      <path d="M25.5 23.5c2.2-3.8 5.3-5.4 8.5-5.3.4 3.6-2.4 6.1-8.5 5.3Z" fill="var(--brand-leaf, var(--green700))" />
      <path d="M25.5 23.5v6.2" stroke="var(--brand-leaf, var(--green700))" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M17.5 30.2c3.2 1.1 6 1 9.3-.2" stroke="var(--brand-gold, var(--gold500))" strokeWidth="3" strokeLinecap="round" />
      <path d="M11 37.2c4.6-2.6 9-2.7 13.2-.2M17 40.2c3.8-1.9 7-2 10-.4" stroke="var(--brand-soil, var(--gold800))" strokeWidth="2" strokeLinecap="round" opacity=".85" />
    </svg>
  );
}

export function BrandMark({
  href = '/',
  compact = false,
  tagline = true,
  inverse = false,
  label = 'SABDITANI — sarana abdi tani, beranda',
}: {
  href?: string;
  compact?: boolean;
  tagline?: boolean;
  inverse?: boolean;
  label?: string;
}) {
  return (
    <Link href={href} className={`brand${inverse ? ' brand-inverse' : ''}`} aria-label={label}>
      <BrandGlyph />
      {!compact && (
        <span className="brand-word">
          <strong><span>SABDI</span><span>TANI</span></strong>
          {tagline && <span className="brand-tagline">sarana abdi tani</span>}
        </span>
      )}
    </Link>
  );
}

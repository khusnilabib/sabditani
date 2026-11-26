import Image from 'next/image';
import Link from 'next/link';

export function BrandMark({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="brand" aria-label="SABDITANI — beranda">
      <Image src="/brand/logo-icon-transparent.png" alt="" width={40} height={40} className="brand-icon" priority />
      {!compact && (
        <span className="brand-word">
          <strong><span className="g">SABDI</span><span className="b">TANI</span></strong>
          <small>sarana abdi tani</small>
        </span>
      )}
    </Link>
  );
}

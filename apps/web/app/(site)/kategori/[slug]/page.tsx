import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, formatDate, guides } from '@sabditani/core';
import { VerifiedSeal } from '@/components/VerifiedSeal';

export function generateStaticParams() { return categories.map((category) => ({ slug: category.slug })); }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const items = guides.filter((guide) => guide.category === slug);
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><Link href="/panduan">Panduan</Link><span>/</span><span>{category.name}</span></div>
          <span className="eyebrow">Kategori</span><h1>{category.name}</h1><p>{category.description}</p>
        </div>
      </header>
      <div className="container" style={{ padding: '48px 0 96px' }}>
        <div className="grid-2">
          {items.map((guide) => (
            <Link key={guide.id} href={`/panduan/${guide.slug}`} className="card card-hover">
              <h3>{guide.title}</h3><p>{guide.summary}</p>
              <div className="card-footer"><span>{formatDate(guide.updatedAt)}</span>{guide.fieldVerified && <VerifiedSeal when={guide.verifiedAt} />}</div>
            </Link>
          ))}
          {!items.length && <div className="empty-state" style={{ gridColumn: '1 / -1' }}>Belum ada panduan pada kategori ini. <Link className="text-link" href="/panduan">Lihat semua panduan</Link></div>}
        </div>
      </div>
    </>
  );
}

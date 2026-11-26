import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, guides, site, commodities } from '@sabditani/core';
import { extractHeadings, Markdown } from '@/components/Markdown';
import { VerifiedSeal } from '@/components/VerifiedSeal';
import { PrintButton } from '@/components/PrintButton';

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return { title: 'Panduan tidak ditemukan' };
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/panduan/${guide.slug}` },
    openGraph: {
      type: 'article', title: guide.title, description: guide.summary, url: `/panduan/${guide.slug}`,
      publishedTime: guide.publishedAt, modifiedTime: guide.updatedAt,
      images: guide.coverUrl ? [{ url: guide.coverUrl, alt: guide.coverAlt ?? guide.title }] : undefined,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const headings = extractHeadings(guide.body);
  const crop = commodities.find((item) => item.id === guide.commodityId);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    inLanguage: 'id',
    mainEntityOfPage: `${site.domain}/panduan/${guide.slug}`,
    author: { '@type': 'Person', name: guide.author, jobTitle: guide.authorRole },
    publisher: { '@type': 'Organization', name: site.name, description: site.tagline },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Panduan', item: `${site.domain}/panduan` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `${site.domain}/panduan/${guide.slug}` },
      ],
    },
  };

  return (
    <>
      {guide.coverUrl && <link rel="preload" as="image" href={guide.coverUrl} fetchPriority="high" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-head">
        <div className="container-narrow">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><Link href="/panduan">Panduan</Link><span>/</span><span>{guide.title}</span></div>
          <span className="eyebrow">{guide.category.replace('-', ' & ')}</span>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
        </div>
      </header>
      <div className="container article-layout">
        <article>
          {guide.coverUrl && (
            <figure className="guide-cover">
              <img src={guide.coverUrl} alt={guide.coverAlt ?? `Ilustrasi lahan untuk panduan ${guide.title}`} width={800} height={450} loading="eager" fetchPriority="high" />
              <figcaption>Ilustrasi lapangan. Angka dan langkah tetap mengikuti kondisi lahan Anda.</figcaption>
            </figure>
          )}
          <div className="article-meta">
            <span>Oleh <strong>{guide.author}</strong>, {guide.authorRole}</span>
            <span>Terbit {formatDate(guide.publishedAt)}</span>
            <span>Diperbarui {formatDate(guide.updatedAt)}</span>
            <span>{guide.readingMinutes} menit baca</span>
          </div>
          {guide.fieldVerified && (
            <div style={{ marginBottom: 28 }}><VerifiedSeal by={guide.verifiedBy} when={guide.verifiedAt} /></div>
          )}
          <Markdown source={guide.body} />
          <div className="callout" style={{ marginTop: 48 }}>
            <strong>Panduan umum</strong>
            Angka dan langkah di atas disusun sebagai panduan umum. Sesuaikan dengan kondisi lahan, varietas, dan anjuran penyuluh setempat.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32, alignItems: 'center' }}>
            <PrintButton />
            {crop && <Link className="btn btn-secondary btn-small" href={`/komoditas/${crop.slug}`}>Lihat komoditas {crop.name}</Link>}
            <Link className="btn btn-secondary btn-small" href="/metodologi">Metodologi kami</Link>
          </div>
        </article>
        <aside className="toc">
          <h4>Daftar isi</h4>
          {headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}
          <h4 style={{ marginTop: 24 }}>Topik terkait</h4>
          {guide.tags.slice(0, 4).map((tag) => (
            <Link key={tag} href={`/kategori/${guide.category}`}>#{tag}</Link>
          ))}
        </aside>
      </div>
    </>
  );
}

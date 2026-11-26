import type { MetadataRoute } from 'next';
import { commodities, guides, pests, site } from '@sabditani/core';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/panduan', '/komoditas', '/hama', '/tentang', '/metodologi', '/kontak', '/privasi', '/app', '/app/kalender', '/app/alat', '/app/alat/pupuk', '/app/alat/populasi', '/app/alat/usaha', '/app/diagnosa', '/app/cari', '/app/tersimpan', '/app/pengaturan'];
  const now = new Date();
  return [
    ...staticRoutes.map((path) => ({ url: `${site.domain}${path}`, lastModified: now, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...guides.map((guide) => ({ url: `${site.domain}/panduan/${guide.slug}`, lastModified: new Date(guide.updatedAt), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...commodities.map((crop) => ({ url: `${site.domain}/komoditas/${crop.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...pests.map((pest) => ({ url: `${site.domain}/hama/${pest.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}

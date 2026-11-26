export type Season = 'rainy' | 'transition' | 'dry';
export type Activity =
  | 'semai'
  | 'olah_lahan'
  | 'tanam'
  | 'pemupukan'
  | 'panen'
  | 'pascapanen';

export type BodyPart = 'daun' | 'batang' | 'buah' | 'akar' | 'bunga' | 'seluruh';

export interface Commodity {
  id: string;
  slug: string;
  name: string;
  group: 'pangan' | 'hortikultura' | 'perkebunan';
  summary: string;
  detail: string;
  accent: string;
  seedRate: string;
}

export interface Zone {
  id: string;
  slug: string;
  name: string;
  description: string;
  rainyMonths: number[];
}

export interface CalendarEntry {
  id: string;
  commodityId: string;
  zoneId: string;
  activity: Activity;
  startMonth: number;
  endMonth: number;
  note: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  commodityId?: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  fieldVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  readingMinutes: number;
  tags: string[];
  body: string;
  coverUrl?: string;
  coverAlt?: string;
}

export interface Pest {
  id: string;
  slug: string;
  name: string;
  kind: 'hama' | 'penyakit' | 'gulma' | 'kekurangan_hara';
  summary: string;
  cause: string;
  controlMd: string;
  commodityIds: string[];
  symptomIds: string[];
}

export interface Symptom {
  id: string;
  name: string;
  bodyPart: BodyPart;
  description: string;
}

export interface SearchItem {
  type: 'panduan' | 'komoditas' | 'hama' | 'alat';
  title: string;
  summary: string;
  url: string;
  keywords?: string;
}

export interface CalcResult {
  total: number;
  perApplication?: number;
  cost: number;
  breakdown: { label: string; value: string }[];
  notes: string[];
}

export interface DiagnosisMatch {
  pestId: string;
  name: string;
  score: number;
  matched: string[];
  kind: Pest['kind'];
}

export interface ArticleDraft {
  id: string;
  title: string;
  slug: string;
  summary: string;
  bodyMd: string;
  category: string;
  commodityId: string;
  status: 'draft' | 'scheduled' | 'published';
  fieldVerified: boolean;
  coverAlt: string;
  seoTitle: string;
  seoDesc: string;
  version: number;
  updatedAt: string;
  syncState: 'local' | 'syncing' | 'synced' | 'conflict';
  mediaUris: string[];
}

import type { SearchItem } from './types';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function searchItems(items: SearchItem[], query: string, limit = 12): SearchItem[] {
  const q = normalize(query);
  if (!q) return items.slice(0, limit);
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = items
    .map((item) => {
      const title = normalize(item.title);
      const haystack = normalize(`${item.title} ${item.summary} ${item.keywords ?? ''}`);
      const allTerms = terms.every((term) => haystack.includes(term));
      const score = title.includes(q) ? 3 : haystack.includes(q) ? 2 : allTerms ? 1 : 0;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}

export const searchGroups: SearchItem['type'][] = ['panduan', 'komoditas', 'hama', 'alat'];

export const groupLabels: Record<SearchItem['type'], string> = {
  panduan: 'Panduan',
  komoditas: 'Komoditas',
  hama: 'Hama & Penyakit',
  alat: 'Alat Hitung',
};

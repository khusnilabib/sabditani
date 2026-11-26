import type { Activity, CalendarEntry, Season } from './types';

export const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const activityLabels: Record<Activity, string> = {
  semai: 'Semai',
  olah_lahan: 'Olah lahan',
  tanam: 'Tanam',
  pemupukan: 'Pemupukan',
  panen: 'Panen',
  pascapanen: 'Pascapanen',
};

/** Jendela boleh melintasi pergantian tahun (mis. Nov–Feb). */
export function isWindowActive(month: number, startMonth: number, endMonth: number): boolean {
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth;
  return month >= startMonth || month <= endMonth;
}

export function seasonForMonth(rainyMonths: number[], month: number): Season {
  if (rainyMonths.includes(month)) return 'rainy';
  const previous = month === 1 ? 12 : month - 1;
  const next = month === 12 ? 1 : month + 1;
  if (rainyMonths.includes(previous) || rainyMonths.includes(next)) return 'transition';
  return 'dry';
}

export const seasonLabels: Record<Season, string> = {
  rainy: 'Musim hujan',
  transition: 'Pancaroba',
  dry: 'Musim kemarau',
};

export function seasonMessage(season: Season): string {
  if (season === 'rainy') return 'Saat yang tepat untuk mengolah lahan dan menyemai.';
  if (season === 'transition') return 'Saatnya menyiapkan bedengan dan mengawasi perubahan cuaca.';
  return 'Fokus pada perawatan, pengairan, dan pengendalian hama.';
}

export function entriesFor(entries: CalendarEntry[], commodityId: string, zoneId: string, activity?: Activity) {
  return entries.filter(
    (e) => e.commodityId === commodityId && e.zoneId === zoneId && (!activity || e.activity === activity)
  );
}

export function activeEntries(entries: CalendarEntry[], commodityId: string, zoneId: string, month: number) {
  return entriesFor(entries, commodityId, zoneId).filter((e) => isWindowActive(month, e.startMonth, e.endMonth));
}

export function windowLabel(startMonth: number, endMonth: number): string {
  return `${monthNames[startMonth - 1]} – ${monthNames[endMonth - 1]}`;
}

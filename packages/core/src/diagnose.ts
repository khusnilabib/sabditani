import type { DiagnosisMatch, Pest } from './types';

/**
 * Skor berbasis aturan (bukan AI): gejala terpilih yang cocok dibagi total gejala pada hama/penyakit.
 * Hasil selalu disebut "kemungkinan", bukan kepastian.
 */
export function scoreDiagnosis(
  selectedSymptomIds: string[],
  cropId: string,
  pests: Pest[]
): DiagnosisMatch[] {
  const selected = new Set(selectedSymptomIds);
  if (selected.size === 0) return [];
  return pests
    .map((pest) => {
      const relevant = pest.commodityIds.includes(cropId) || pest.commodityIds.length === 0;
      const matched = pest.symptomIds.filter((id) => selected.has(id));
      return {
        pestId: pest.id,
        name: pest.name,
        kind: pest.kind,
        matched,
        score: relevant && pest.symptomIds.length > 0 ? matched.length / pest.symptomIds.length : 0,
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 5);
}

export const diagnosisDisclaimer =
  'Hasil ini kemungkinan, bukan kepastian. Pastikan dengan penyuluh atau petugas setempat.';

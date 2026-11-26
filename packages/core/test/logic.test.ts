import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFertilizer,
  calculatePopulation,
  calculateBusiness,
  isWindowActive,
  seasonForMonth,
  scoreDiagnosis,
  searchItems,
  searchIndex,
  pests,
} from '../src/index.ts';

test('pupuk: 1 ha × 300 kg/ha = 300 kg, 3 aplikasi', () => {
  const result = calculateFertilizer({ area: 1, unit: 'ha', doseKgPerHa: 300, applications: 3, pricePerKg: 14_000 });
  assert.equal(result.total, 300);
  assert.equal(result.perApplication, 100);
  assert.equal(result.cost, 4_200_000);
});

test('pupuk: 1.000 m² setara 0,1 ha', () => {
  const result = calculateFertilizer({ area: 1000, unit: 'm2', doseKgPerHa: 300, applications: 3, pricePerKg: 14_000 });
  assert.equal(result.total, 30);
});

test('populasi: luas efektif dan cadangan sulam', () => {
  const result = calculatePopulation({
    area: 1, unit: 'ha', rowMeters: 0.7, plantMeters: 0.25,
    nonPlantPct: 10, reservePct: 10, germinationPct: 85,
  });
  assert.ok(Math.abs(result.total - 9000 / 0.175) < 1);
  assert.ok(result.cost > result.total);
});

test('usaha: laba, R/C dan BEP', () => {
  const result = calculateBusiness({ yieldKg: 4000, pricePerKg: 18_000, fixedCost: 4_500_000, variableCost: 12_000_000 });
  assert.equal(result.revenue, 72_000_000);
  assert.equal(result.cost, 16_500_000);
  assert.equal(result.profit, 55_500_000);
  assert.equal(result.bepPrice, 4125);
  assert.equal(result.sensitivity.length, 7);
});

test('kalender: jendela melintasi tahun', () => {
  assert.equal(isWindowActive(12, 11, 2), true);
  assert.equal(isWindowActive(1, 11, 2), true);
  assert.equal(isWindowActive(5, 11, 2), false);
});

test('musim: bulan hujan, pancaroba, dan kemarau', () => {
  const rainy = [11, 12, 1, 2, 3];
  assert.equal(seasonForMonth(rainy, 1), 'rainy');
  assert.equal(seasonForMonth(rainy, 4), 'transition');
  assert.equal(seasonForMonth(rainy, 7), 'dry');
});

test('diagnosa: skor dan urutan kemungkinan', () => {
  const result = scoreDiagnosis(['daun-menggulung', 'bintik-putih'], 'cabai', pests);
  assert.equal(result[0].pestId, 'kutu-keputih');
  assert.ok(result[0].score <= 1 && result[0].score > 0);
  assert.ok(result.every((entry) => entry.score > 0));
});

test('pencarian: menemukan panduan dan alat', () => {
  assert.ok(searchItems(searchIndex, 'pupuk').length > 0);
  const tool = searchItems(searchIndex, 'hitung populasi').find((item) => item.type === 'alat');
  assert.ok(tool);
});

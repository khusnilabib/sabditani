import type { CalcResult } from './types';

export type AreaUnit = 'm2' | 'ha';

export function toHectares(area: number, unit: AreaUnit): number {
  return unit === 'ha' ? area : area / 10_000;
}

export function calculateFertilizer(input: {
  area: number;
  unit: AreaUnit;
  doseKgPerHa: number;
  applications: number;
  pricePerKg: number;
}): CalcResult {
  const { area, unit, doseKgPerHa, applications, pricePerKg } = input;
  const hectares = toHectares(Math.max(0, area), unit);
  const total = hectares * Math.max(0, doseKgPerHa);
  const perApplication = applications > 0 ? total / applications : 0;
  const cost = total * Math.max(0, pricePerKg);
  return {
    total,
    perApplication,
    cost,
    breakdown: [
      { label: 'Luas lahan', value: `${area.toLocaleString('id-ID')} ${unit === 'ha' ? 'ha' : 'm²'}` },
      { label: 'Setara', value: `${hectares.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ha` },
      { label: 'Dosis', value: `${doseKgPerHa.toLocaleString('id-ID')} kg/ha` },
      { label: 'Jumlah aplikasi', value: `${applications} kali` },
    ],
    notes: [
      'Angka ini panduan umum. Sesuaikan dengan analisis tanah dan kondisi lahan Anda.',
      'Gunakan sarung tangan dan masker saat menyiapkan pupuk.',
    ],
  };
}

export function calculatePopulation(input: {
  area: number;
  unit: AreaUnit;
  rowMeters: number;
  plantMeters: number;
  nonPlantPct: number;
  reservePct: number;
  germinationPct: number;
}): CalcResult {
  const { area, unit, rowMeters, plantMeters, nonPlantPct, reservePct, germinationPct } = input;
  const areaM2 = Math.max(0, unit === 'ha' ? area * 10_000 : area);
  const effective = areaM2 * (1 - nonPlantPct / 100);
  const spacing = Math.max(0.0001, rowMeters) * Math.max(0.0001, plantMeters);
  const population = effective / spacing;
  const germination = Math.max(0.01, germinationPct / 100);
  const seed = (population * (1 + reservePct / 100)) / germination;
  return {
    total: population,
    cost: seed,
    breakdown: [
      { label: 'Luas efektif', value: `${effective.toLocaleString('id-ID', { maximumFractionDigits: 0 })} m²` },
      { label: 'Jarak tanam', value: `${rowMeters} × ${plantMeters} m` },
      { label: 'Cadangan sulam', value: `${reservePct}%` },
      { label: 'Daya kecambah', value: `${germinationPct}%` },
    ],
    notes: [
      'Jarak tanam dalam meter. Pastikan satuan luas dan jarak konsisten.',
      'Sesuaikan jumlah benih dengan kualitas benih di lapangan.',
    ],
  };
}

export function calculateBusiness(input: {
  yieldKg: number;
  pricePerKg: number;
  fixedCost: number;
  variableCost: number;
}): CalcResult & { revenue: number; cost: number; profit: number; rc: number; bepPrice: number; bepProduction: number; sensitivity: { change: number; revenue: number; profit: number }[] } {
  const { yieldKg, pricePerKg, fixedCost, variableCost } = input;
  const revenue = Math.max(0, yieldKg) * Math.max(0, pricePerKg);
  const cost = Math.max(0, fixedCost) + Math.max(0, variableCost);
  const profit = revenue - cost;
  const rc = cost > 0 ? revenue / cost : 0;
  const bepPrice = yieldKg > 0 ? cost / yieldKg : 0;
  const bepProduction = pricePerKg > 0 ? cost / pricePerKg : 0;
  const sensitivity = [-30, -20, -10, 0, 10, 20, 30].map((change) => {
    const p = pricePerKg * (1 + change / 100);
    return { change, revenue: yieldKg * p, profit: yieldKg * p - cost };
  });
  return {
    total: revenue,
    cost,
    revenue,
    profit,
    rc,
    bepPrice,
    bepProduction,
    sensitivity,
    breakdown: [
      { label: 'Hasil panen', value: `${yieldKg.toLocaleString('id-ID')} kg` },
      { label: 'Harga jual', value: `Rp ${pricePerKg.toLocaleString('id-ID')}/kg` },
      { label: 'Biaya tetap', value: `Rp ${fixedCost.toLocaleString('id-ID')}` },
      { label: 'Biaya variabel', value: `Rp ${variableCost.toLocaleString('id-ID')}` },
    ],
    notes: [
      'R/C = pendapatan dibagi biaya. BEP harga = biaya dibagi hasil panen.',
      'Harga dan hasil panen berubah antarwilayah. Isi dengan angka lapangan Anda.',
    ],
  };
}

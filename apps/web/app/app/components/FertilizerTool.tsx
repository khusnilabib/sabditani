'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { calcParams, calculateFertilizer, commodities, formatCurrency, formatNumber, type AreaUnit } from '@sabditani/core';
import { NumberField, ResultPanel, ToolHeader } from './ToolParts';
import { IconExternal } from '@/components/Icons';

export function FertilizerTool({ initialCrop }: { initialCrop: string }) {
  const [area, setArea] = useState(1000);
  const [unit, setUnit] = useState<AreaUnit>('m2');
  const [dose, setDose] = useState<number>(calcParams.pupuk.defaultDosis);
  const [applications, setApplications] = useState<number>(calcParams.pupuk.defaultApplications);
  const [price, setPrice] = useState<number>(calcParams.pupuk.defaultPrice);
  const crop = commodities.find((item) => item.id === initialCrop) ?? commodities[0];

  const result = useMemo(
    () => calculateFertilizer({ area, unit, doseKgPerHa: dose, applications, pricePerKg: price }),
    [area, unit, dose, applications, price]
  );

  return (
    <>
      <ToolHeader
        eyebrow="Alat › Pupuk"
        title="Hitung Pupuk"
        description={`Berapa pupuk yang dibutuhkan lahan Anda? Contoh ini untuk ${crop.name.toLowerCase()}. Angka berubah seketika saat Anda mengisi data.`}
      />
      <div className="tool-layout">
        <div className="panel">
          <span className="panel-title">Masukkan data lahan</span>
          <div className="field">
            <label htmlFor="area">Berapa luas lahan Anda?</label>
            <div className="input-with-unit">
              <input id="area" className="input" type="number" min="0" step="any" value={area} onChange={(e) => setArea(Number(e.target.value))} />
              <select className="select" value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} aria-label="Satuan luas">
                <option value="m2">m²</option><option value="ha">ha</option>
              </select>
            </div>
            <div className="field-help">1 ha = 10.000 m²</div>
          </div>
          <div className="field">
            <label htmlFor="dose">Dosis pupuk (kg/ha)</label>
            <input id="dose" type="range" min="50" max="600" step="10" value={dose} onChange={(e) => setDose(Number(e.target.value))} />
            <div className="field-help"><strong>{dose} kg/ha</strong> · geser untuk mencoba dosis lain</div>
          </div>
          <NumberField label="Jumlah aplikasi" value={applications} onChange={setApplications} min={1} suffix="kali" />
          <NumberField label="Harga pupuk per kg" value={price} onChange={setPrice} suffix="Rp per kg" />
          <div className="notice" style={{ marginTop: 8 }}>
            {calcParams.pupuk.note} <Link className="text-link" href={`/panduan/pemupukan-${crop.id === 'cabai' ? 'cabai' : 'cabai'}`}>Baca panduan <IconExternal style={{ width: 12, height: 12, display: 'inline' }} /></Link>
          </div>
        </div>
        <ResultPanel
          value={`${formatNumber(result.total, 1)} kg`}
          caption={`total kebutuhan pupuk · ${formatNumber(result.perApplication ?? 0, 1)} kg per aplikasi`}
          breakdown={[...result.breakdown, { label: 'Per aplikasi', value: `${formatNumber(result.perApplication ?? 0, 1)} kg` }, { label: 'Total biaya', value: formatCurrency(result.cost) }]}
          notes={result.notes}
          saveId={`pupuk:${crop.slug}:${area}:${unit}:${dose}`}
          saveTitle="Hitung Pupuk"
          saveDetail={`${formatNumber(result.total, 1)} kg · ${formatCurrency(result.cost)} · ${crop.name}`}
        >
          <p className="small muted" style={{ marginTop: 20 }}>Gunakan sarung tangan dan masker saat menyiapkan pupuk. Jangan mengaplikasikan saat daun basa atau hujan deras.</p>
        </ResultPanel>
      </div>
    </>
  );
}

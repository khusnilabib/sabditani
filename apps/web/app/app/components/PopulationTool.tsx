'use client';

import { useMemo, useState } from 'react';
import { calcParams, calculatePopulation, formatNumber, type AreaUnit } from '@sabditani/core';
import { NumberField, ResultPanel, ToolHeader } from './ToolParts';

export function PopulationTool() {
  const [area, setArea] = useState(1);
  const [unit, setUnit] = useState<AreaUnit>('ha');
  const [row, setRow] = useState<number>(calcParams.populasi.defaultRow);
  const [plant, setPlant] = useState<number>(calcParams.populasi.defaultPlant);
  const [nonPlant, setNonPlant] = useState(calcParams.populasi.defaultNonPlant * 100);
  const [reserve, setReserve] = useState(calcParams.populasi.defaultReserve * 100);
  const [germination, setGermination] = useState(calcParams.populasi.defaultGermination * 100);

  const result = useMemo(
    () => calculatePopulation({ area, unit, rowMeters: row, plantMeters: plant, nonPlantPct: nonPlant, reservePct: reserve, germinationPct: germination }),
    [area, unit, row, plant, nonPlant, reserve, germination]
  );

  return (
    <>
      <ToolHeader eyebrow="Alat › Populasi" title="Populasi Tanam" description="Hitung jumlah tanaman dan kebutuhan benih dari luas lahan serta jarak tanam yang Anda pakai." />
      <div className="tool-layout">
        <div className="panel">
          <span className="panel-title">Data lahan</span>
          <div className="field">
            <label htmlFor="area">Luas lahan</label>
            <div className="input-with-unit">
              <input id="area" className="input" type="number" min="0" step="any" value={area} onChange={(e) => setArea(Number(e.target.value))} />
              <select className="select" value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} aria-label="Satuan luas">
                <option value="ha">ha</option><option value="m2">m²</option>
              </select>
            </div>
          </div>
          <NumberField label="Jarak antarbaris" value={row} onChange={setRow} step={0.05} suffix="meter" />
          <NumberField label="Jarak dalam baris" value={plant} onChange={setPlant} step={0.05} suffix="meter" />
          <NumberField label="Bagian non-tanam" value={nonPlant} onChange={setNonPlant} suffix="% dari luas" />
          <NumberField label="Cadangan sulam" value={reserve} onChange={setReserve} suffix="%" />
          <NumberField label="Daya kecambah" value={germination} onChange={setGermination} suffix="%" />
          <p className="field-help">{calcParams.populasi.note}</p>
        </div>
        <ResultPanel
          value={formatNumber(result.total)}
          caption="populasi tanaman pada lahan Anda"
          breakdown={[...result.breakdown, { label: 'Kebutuhan benih', value: `${formatNumber(result.cost)} benih` }]}
          notes={result.notes}
          saveId={`populasi:${area}:${unit}:${row}:${plant}`}
          saveTitle="Populasi Tanam"
          saveDetail={`${formatNumber(result.total)} tanaman · ${formatNumber(result.cost)} benih`}
        >
          <p className="small muted" style={{ marginTop: 20 }}>Rumus: luas efektif ÷ (jarak baris × jarak dalam baris). Benih = populasi × (1 + cadangan sulam) ÷ daya kecambah.</p>
        </ResultPanel>
      </div>
    </>
  );
}

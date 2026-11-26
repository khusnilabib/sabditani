'use client';

import { useMemo, useState } from 'react';
import { calcParams, calculateBusiness, formatCurrency, formatNumber } from '@sabditani/core';
import { NumberField, ResultPanel, ToolHeader } from './ToolParts';

type BusinessInput = { yieldKg: number; pricePerKg: number; fixedCost: number; variableCost: number };
type BusinessOutput = ReturnType<typeof calculateBusiness>;

const defaultInput: BusinessInput = {
  yieldKg: calcParams.usaha.defaultYield,
  pricePerKg: calcParams.usaha.defaultPrice,
  fixedCost: calcParams.usaha.defaultFixedCost,
  variableCost: calcParams.usaha.defaultVariableCost,
};

function SensitivityChart({ result }: { result: BusinessOutput }) {
  const width = 520, height = 180, pad = 24;
  const max = Math.max(...result.sensitivity.map((point) => Math.abs(point.profit)), 1);
  const step = (width - pad * 2) / result.sensitivity.length;
  const zeroY = height / 2;
  return (
    <div>
      <span className="panel-title" style={{ marginTop: 24 }}>Sensitivitas harga ±30%</span>
      <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Grafik sensitivitas laba terhadap perubahan harga. ${result.sensitivity.map((p) => `${p.change}%: ${formatCurrency(p.profit)}`).join(', ')}.`}>
        <line className="zero" x1={pad} x2={width - pad} y1={zeroY} y2={zeroY} />
        {result.sensitivity.map((point, index) => {
          const barHeight = (Math.abs(point.profit) / max) * (height / 2 - pad);
          const x = pad + index * step + step * 0.2;
          return (
            <g key={point.change}>
              <rect className={`bar${point.profit < 0 ? ' negative' : ''}`} x={x} y={point.profit >= 0 ? zeroY - barHeight : zeroY} width={step * 0.6} height={Math.max(1, barHeight)} rx="3" />
              <text x={x + step * 0.3} y={height - 4} textAnchor="middle" fontSize="10" fill="var(--ink-muted)">{point.change > 0 ? '+' : ''}{point.change}%</text>
            </g>
          );
        })}
      </svg>
      <p className="small muted">Batang menunjukkan laba pada setiap perubahan harga. Merah berarti rugi.</p>
    </div>
  );
}

export function BusinessTool() {
  const [scenario, setScenario] = useState<'A' | 'B'>('A');
  const [inputs, setInputs] = useState<{ A: BusinessInput; B: BusinessInput }>({ A: { ...defaultInput }, B: { ...defaultInput } });
  const [hasB, setHasB] = useState(false);

  const results = useMemo<{ A: BusinessOutput; B: BusinessOutput }>(() => ({
    A: calculateBusiness(inputs.A),
    B: calculateBusiness(inputs.B),
  }), [inputs]);
  const result = results[scenario];
  const current = inputs[scenario];

  const update = (key: keyof BusinessInput, value: number) => {
    setInputs((state) => ({ ...state, [scenario]: { ...state[scenario], [key]: value } }));
  };

  return (
    <>
      <ToolHeader eyebrow="Alat › Usaha" title="Analisis Usaha" description="Hitung laba, R/C, dan titik impas. Bandingkan dua skenario harga atau hasil panen." />
      <div className="segmented" style={{ marginBottom: 24 }}>
        <button aria-pressed={scenario === 'A'} onClick={() => setScenario('A')}>Skenario A</button>
        <button aria-pressed={scenario === 'B'} onClick={() => { if (!hasB) { setInputs((s) => ({ ...s, B: { ...s.A } })); setHasB(true); } setScenario('B'); }}>
          {hasB ? 'Skenario B' : 'Skenario B +'}
        </button>
      </div>
      <div className="tool-layout">
        <div className="panel">
          <span className="panel-title">Data usaha · skenario {scenario}</span>
          <NumberField label="Hasil panen" value={current.yieldKg} onChange={(v) => update('yieldKg', v)} suffix="kg" />
          <NumberField label="Harga jual per kg" value={current.pricePerKg} onChange={(v) => update('pricePerKg', v)} suffix="Rp" />
          <NumberField label="Biaya tetap" value={current.fixedCost} onChange={(v) => update('fixedCost', v)} suffix="Rp" />
          <NumberField label="Biaya variabel" value={current.variableCost} onChange={(v) => update('variableCost', v)} suffix="Rp" />
          <p className="field-help">{calcParams.usaha.note}</p>
          {hasB && (
            <div className="scenario-grid">
              <div className="stat"><span>Laba A</span><strong>{formatCurrency(results.A.profit)}</strong></div>
              <div className="stat"><span>Laba B</span><strong>{formatCurrency(results.B.profit)}</strong></div>
            </div>
          )}
        </div>
        <ResultPanel
          value={formatCurrency(result.profit)}
          caption={`laba · skenario ${scenario}`}
          breakdown={[
            ...result.breakdown,
            { label: 'Pendapatan', value: formatCurrency(result.revenue) },
            { label: 'R/C ratio', value: formatNumber(result.rc, 2) },
            { label: 'BEP harga', value: `${formatCurrency(result.bepPrice)}/kg` },
            { label: 'BEP produksi', value: `${formatNumber(result.bepProduction)} kg` },
          ]}
          notes={result.notes}
          saveId={`usaha:${scenario}:${current.pricePerKg}:${current.yieldKg}`}
          saveTitle="Analisis Usaha"
          saveDetail={`Laba ${formatCurrency(result.profit)} · R/C ${formatNumber(result.rc, 2)}`}
        >
          <SensitivityChart result={result} />
        </ResultPanel>
      </div>
      <div className="notice" style={{ marginTop: 24 }}>Angka ini panduan umum. Harga dan hasil panen sangat berbeda antarwilayah dan musim.</div>
    </>
  );
}

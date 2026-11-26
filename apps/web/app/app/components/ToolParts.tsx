'use client';

import { useCopy } from '@/hooks/useCopy';
import { useSaved } from '@/hooks/useSaved';
import { IconCheck, IconCopy, IconBookmark, IconWhatsapp } from '@/components/Icons';

export function ToolHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="app-page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
    </div>
  );
}

export function NumberField({ label, value, onChange, suffix, help, min = 0, step = 1 }: {
  label: string; value: number; onChange: (value: number) => void; suffix?: string; help?: string; min?: number; step?: number;
}) {
  return (
    <div className="field">
      <label htmlFor={`field-${label}`}>{label}</label>
      <input
        id={`field-${label}`}
        className="input"
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {suffix && <div className="field-help">Satuan: {suffix}</div>}
      {help && <div className="field-help">{help}</div>}
    </div>
  );
}

export function ResultPanel({ value, caption, breakdown, notes, children, saveId, saveTitle, saveDetail }: {
  value: string;
  caption: string;
  breakdown: { label: string; value: string }[];
  notes: string[];
  children?: React.ReactNode;
  saveId: string;
  saveTitle: string;
  saveDetail: string;
}) {
  const { copied, copy } = useCopy();
  const { add } = useSaved();
  const shareText = `${saveTitle}: ${value}. ${caption}. Dihitung di SABDITANI — sarana abdi tani.`;
  return (
    <div className="panel">
      <span className="panel-title">Hasil</span>
      <div className="result-hero">
        <div className="result-number">{value}</div>
        <div className="result-caption">{caption}</div>
      </div>
      <div className="stat-grid">
        {breakdown.map((item) => (
          <div className="stat" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>
        ))}
      </div>
      {children}
      <div className="action-row">
        <button className="btn btn-secondary btn-small" onClick={() => copy(shareText)}>
          {copied ? <IconCheck style={{ width: 16, height: 16 }} /> : <IconCopy style={{ width: 16, height: 16 }} />}
          {copied ? 'Tersalin' : 'Salin'}
        </button>
        <a className="btn btn-secondary btn-small" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
          <IconWhatsapp style={{ width: 16, height: 16 }} /> WhatsApp
        </a>
        <button className="btn btn-tonal btn-small" onClick={() => add({ id: saveId, type: saveId.split(':')[0] as 'pupuk' | 'populasi' | 'usaha', title: saveTitle, detail: saveDetail })}>
          <IconBookmark style={{ width: 16, height: 16 }} /> Simpan
        </button>
      </div>
      <div className="assumptions">
        <strong>Asumsi</strong>
        <ul>{notes.map((note) => <li key={note}>· {note}</li>)}</ul>
      </div>
    </div>
  );
}

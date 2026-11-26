'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { commodities, diagnosisDisclaimer, pests, scoreDiagnosis, symptoms, type BodyPart } from '@sabditani/core';
import { IconArrow, IconDiagnose, IconExternal } from '@/components/Icons';

const bodyParts: { id: BodyPart; label: string }[] = [
  { id: 'daun', label: 'Daun' }, { id: 'batang', label: 'Batang' }, { id: 'buah', label: 'Buah' },
  { id: 'akar', label: 'Akar' }, { id: 'bunga', label: 'Bunga' }, { id: 'seluruh', label: 'Seluruh tanaman' },
];

export default function DiagnosaPage() {
  const [step, setStep] = useState(1);
  const [cropId, setCropId] = useState('cabai');
  const [bodyPart, setBodyPart] = useState<BodyPart | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const availableSymptoms = useMemo(
    () => symptoms.filter((symptom) => !bodyPart || symptom.bodyPart === bodyPart || symptom.bodyPart === 'seluruh'),
    [bodyPart]
  );
  const matches = useMemo(() => scoreDiagnosis(selected, cropId, pests), [selected, cropId]);
  const crop = commodities.find((item) => item.id === cropId) ?? commodities[0];

  const toggleSymptom = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const reset = () => { setStep(1); setBodyPart(null); setSelected([]); };

  return (
    <>
      <div className="app-page-head">
        <span className="eyebrow">Diagnosa gejala</span>
        <h1>Diagnosa Gejala</h1>
        <p className="muted">Empat langkah singkat untuk melihat kemungkinan penyebab masalah tanaman Anda.</p>
      </div>
      <div className="steps" aria-label="Langkah diagnosa">
        {['Tanaman', 'Bagian', 'Gejala', 'Hasil'].map((label, index) => (
          <span key={label} className={step === index + 1 ? 'active' : ''}>{index + 1}. {label}</span>
        ))}
      </div>

      <div className="panel" style={{ maxWidth: 860 }}>
        {step === 1 && (
          <>
            <span className="panel-title">Langkah 1 · Pilih tanaman</span>
            <h2 style={{ fontSize: 26, marginBottom: 20 }}>Tanaman apa yang bermasalah?</h2>
            <div className="option-grid">
              {commodities.map((item) => (
                <button key={item.id} className={`option-card${cropId === item.id ? ' selected' : ''}`} onClick={() => setCropId(item.id)}>
                  {item.name}<small>{item.group}</small>
                </button>
              ))}
            </div>
            <div className="action-row"><button className="btn btn-primary" onClick={() => setStep(2)}>Lanjut <IconArrow style={{ width: 16, height: 16 }} /></button></div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="panel-title">Langkah 2 · Bagian tanaman</span>
            <h2 style={{ fontSize: 26, marginBottom: 20 }}>Mana yang bermasalah?</h2>
            <div className="option-grid">
              {bodyParts.map((part) => (
                <button key={part.id} className={`option-card${bodyPart === part.id ? ' selected' : ''}`} onClick={() => setBodyPart(part.id)}>{part.label}</button>
              ))}
            </div>
            <div className="action-row">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Kembali</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!bodyPart}>Lanjut <IconArrow style={{ width: 16, height: 16 }} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <span className="panel-title">Langkah 3 · Gejala</span>
            <h2 style={{ fontSize: 26, marginBottom: 8 }}>Pilih gejala yang terlihat</h2>
            <p className="muted small" style={{ marginBottom: 20 }}>Boleh lebih dari satu. {crop.name} · {bodyPart}</p>
            <div className="option-grid">
              {availableSymptoms.map((symptom) => (
                <button key={symptom.id} className={`option-card${selected.includes(symptom.id) ? ' selected' : ''}`} onClick={() => toggleSymptom(symptom.id)} aria-pressed={selected.includes(symptom.id)}>
                  {symptom.name}<small>{symptom.description}</small>
                </button>
              ))}
            </div>
            <div className="action-row">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Kembali</button>
              <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!selected.length}>Lihat kemungkinan <IconArrow style={{ width: 16, height: 16 }} /></button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <span className="panel-title">Langkah 4 · Hasil sementara</span>
            <h2 style={{ fontSize: 26, marginBottom: 8 }}>Kemungkinan penyebab</h2>
            <p className="muted small" style={{ marginBottom: 24 }}>{crop.name} · {selected.length} gejala dipilih</p>
            {matches.length ? matches.map((match) => {
              const pest = pests.find((item) => item.id === match.pestId)!;
              return (
                <div className="match" key={match.pestId}>
                  <span className="match-score">{Math.round(match.score * 100)}%</span>
                  <div style={{ flex: 1 }}>
                    <h3>{match.name}</h3>
                    <p className="muted small">Kecocokan berdasarkan {match.matched.length} gejala. {pest.kind}.</p>
                    <Link className="text-link" href={`/hama/${pest.slug}`}>Baca pengendalian <IconExternal style={{ width: 12, height: 12, display: 'inline' }} /></Link>
                  </div>
                </div>
              );
            }) : (
              <div className="empty-state"><h3>Belum ada kecocokan</h3><p className="muted">Coba pilih gejala lain atau periksa bagian tanaman yang berbeda.</p></div>
            )}
            <div className="callout warning" style={{ marginTop: 24 }}>
              <strong>Pastikan kembali</strong>{diagnosisDisclaimer}
            </div>
            <div className="action-row">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>Ubah gejala</button>
              <button className="btn btn-secondary" onClick={reset}><IconDiagnose style={{ width: 16, height: 16 }} /> Diagnosa ulang</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

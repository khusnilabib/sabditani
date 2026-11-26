'use client';

export function PrintButton() {
  return <button className="btn btn-secondary btn-small" onClick={() => window.print()}>Cetak panduan</button>;
}

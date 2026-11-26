import { Suspense } from 'react';
import { FertilizerPageClient } from '../../components/FertilizerPageClient';

export const metadata = { title: 'Hitung Pupuk' };

export default function FertilizerPage() {
  return (
    <Suspense fallback={<p className="muted">Memuat alat hitung…</p>}>
      <FertilizerPageClient />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { SearchPageWrapper } from '../components/SearchPageWrapper';

export const metadata = { title: 'Pencarian' };

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="muted">Memuat pencarian…</p>}>
      <SearchPageWrapper />
    </Suspense>
  );
}

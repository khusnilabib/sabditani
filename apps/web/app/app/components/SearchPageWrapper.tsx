'use client';

import { useSearchParams } from 'next/navigation';
import { SearchPageClient } from './SearchPageClient';

export function SearchPageWrapper() {
  const params = useSearchParams();
  return <SearchPageClient initialQuery={params.get('q') ?? ''} />;
}

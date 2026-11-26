'use client';

import { useSearchParams } from 'next/navigation';
import { CalendarClient } from './CalendarClient';

export function CalendarPageClient() {
  const params = useSearchParams();
  return (
    <CalendarClient
      initialCrop={params.get('komoditas') ?? undefined}
      initialZone={params.get('wilayah') ?? undefined}
    />
  );
}

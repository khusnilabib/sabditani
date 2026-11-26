'use client';

import { useSearchParams } from 'next/navigation';
import { FertilizerTool } from './FertilizerTool';

export function FertilizerPageClient() {
  const params = useSearchParams();
  return <FertilizerTool initialCrop={params.get('komoditas') ?? 'cabai'} />;
}

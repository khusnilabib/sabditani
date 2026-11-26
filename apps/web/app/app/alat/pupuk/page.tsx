import { FertilizerTool } from '../../components/FertilizerTool';

export const metadata = { title: 'Hitung Pupuk' };

export default async function FertilizerPage({ searchParams }: { searchParams: Promise<{ komoditas?: string }> }) {
  const params = await searchParams;
  return <FertilizerTool initialCrop={params.komoditas ?? 'cabai'} />;
}

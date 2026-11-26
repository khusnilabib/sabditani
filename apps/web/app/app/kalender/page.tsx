import { CalendarClient } from '../components/CalendarClient';

export const metadata = { title: 'Kalender Tanam' };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ komoditas?: string; wilayah?: string }> }) {
  const params = await searchParams;
  return <CalendarClient initialCrop={params.komoditas} initialZone={params.wilayah} />;
}

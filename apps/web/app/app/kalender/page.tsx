import { Suspense } from 'react';
import { CalendarPageClient } from '../components/CalendarPageClient';

export const metadata = { title: 'Kalender Tanam' };

export default function CalendarPage() {
  return (
    <Suspense fallback={<p className="muted">Memuat kalender…</p>}>
      <CalendarPageClient />
    </Suspense>
  );
}

import type { Metadata } from 'next';
import { AppShell } from './components/AppShell';

export const metadata: Metadata = {
  title: { default: 'Aplikasi', template: '%s · SABDITANI' },
  description: 'Kalender tanam, alat hitung, dan diagnosa gejala pertanian.',
};

export default function WebAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

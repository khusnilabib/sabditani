import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProgressStem } from '@/components/ProgressStem';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressStem />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

import { IconSeal } from './Icons';

export function VerifiedSeal({ by, when }: { by?: string; when?: string }) {
  return (
    <span className="seal" title={by && when ? `Terverifikasi lapangan · ${when} · oleh ${by}` : 'Terverifikasi lapangan'}>
      <IconSeal />
      Terverifikasi lapangan{when ? ` · ${when}` : ''}
    </span>
  );
}

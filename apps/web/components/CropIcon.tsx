/**
 * Ikon tanaman sederhana untuk kartu komoditas.
 * Bentuknya direduksi jadi siluet yang masih dikenali pada ukuran 40 px.
 */
export function CropIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'crop-icon',
  };

  return (
    <span className="crop-icon-tile" aria-hidden="true">
      <svg {...common}>
        {slug === 'cabai' && <>
          <path d="M29 12c1 6-2 10-7 13-4 2.4-6 5.4-5 9.4.8 3.2 3.8 5 7 4.6" />
          <path d="M29 12c3-1.6 5.5-1.2 7 .6" />
          <path d="M26 10.5c-1.6 2.4-1 5 1.4 6.6" />
        </>}
        {slug === 'padi' && <>
          <path d="M24 39V17" />
          <path d="M24 22c-4.5-1-7-4-7.5-8 4 .4 6.7 2.6 7.5 8Z" />
          <path d="M24 22c4.5-1 7-4 7.5-8-4 .4-6.7 2.6-7.5 8Z" />
          <path d="M24 29c-4.5-1-7-4-7.5-8 4 .4 6.7 2.6 7.5 8Z" />
          <path d="M24 29c4.5-1 7-4 7.5-8-4 .4-6.7 2.6-7.5 8Z" />
          <path d="M24 11c-1.4 2-1 4 .4 5.4" />
        </>}
        {slug === 'jagung' && <>
          <path d="M24 14c5 0 8 4.2 8 10s-3 12-8 12-8-6.2-8-12 3-10 8-10Z" />
          <path d="M18 20h12M18 26h12M19 32h10" />
          <path d="M24 14c-3.8-1.6-7-.8-9 2.6 3.2 1.6 6.4 1.2 9-2.6Z" />
          <path d="M24 14c3.8-1.6 7-.8 9 2.6-3.2 1.6-6.4 1.2-9-2.6Z" />
        </>}
        {slug === 'tomat' && <>
          <path d="M24 19c7 0 12 5 12 11s-5 10-12 10-12-4-12-10 5-11 12-11Z" />
          <path d="M24 19v-5" />
          <path d="M24 15c-3.8-2-7-1.2-8.5 1.8 3.5 1.4 6.6.8 8.5-1.8Z" />
          <path d="M24 15c3.8-2 7-1.2 8.5 1.8-3.5 1.4-6.6.8-8.5-1.8Z" />
        </>}
        {slug === 'bawang-merah' && <>
          <path d="M24 18c-7 4-10 10-9 15 1 4.4 4.6 7 9 7s8-2.6 9-7c1-5-2-11-9-15Z" />
          <path d="M24 18c-1-4 .4-7 3.4-9M24 18c-2.6-3.4-2.4-6.4.2-8.6" />
          <path d="M20 39v3M24 40v3M28 39v3" />
        </>}
        {slug === 'kedelai' && <>
          <path d="M14 18c6 1 12 5.5 16 12 2.6 4 2.4 7-.4 8.4-2.8 1.4-6-.6-8.6-4.4C17 27 14.6 22 14 18Z" />
          <circle cx="20" cy="26" r="2.2" />
          <circle cx="24" cy="31" r="2.2" />
          <path d="M14 18c-1.6-2.6-1.2-5 .8-6.6" />
        </>}
      </svg>
    </span>
  );
}

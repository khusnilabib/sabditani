import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const IconHome = (p: IconProps) => <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /><path d="M9.5 20v-6h5v6" /></svg>;
export const IconCalendar = (p: IconProps) => <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M7 14h4M14 14h3M7 18h7" /></svg>;
export const IconCalculator = (p: IconProps) => <svg {...base(p)}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 18h2M12 18h4" /></svg>;
export const IconDiagnose = (p: IconProps) => <svg {...base(p)}><path d="M12 3v4M8 5h8" /><path d="M10 7v3.5L6 17.5A2 2 0 0 0 7.7 20.5h8.6a2 2 0 0 0 1.7-3L14 10.5V7" /><path d="M7.5 15h9" /></svg>;
export const IconBookmark = (p: IconProps) => <svg {...base(p)}><path d="M6 4h12v17l-6-4-6 4z" /></svg>;
export const IconSearch = (p: IconProps) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
export const IconSun = (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
export const IconMoon = (p: IconProps) => <svg {...base(p)}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></svg>;
export const IconExternal = (p: IconProps) => <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>;
export const IconArrow = (p: IconProps) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const IconCheck = (p: IconProps) => <svg {...base(p)}><path d="m5 12 4 4L19 6" /></svg>;
export const IconCopy = (p: IconProps) => <svg {...base(p)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
export const IconShare = (p: IconProps) => <svg {...base(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-4M8.6 13.4l6.8 4" /></svg>;
export const IconBook = (p: IconProps) => <svg {...base(p)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></svg>;
export const IconSettings = (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21v3h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>;
export const IconSeal = (p: IconProps) => <svg {...base(p)}><path d="m12 3 2.2 1.7 2.8-.2 1 2.6 2.3 1.6-.7 2.7.7 2.7-2.3 1.6-1 2.6-2.8-.2L12 20l-2.2-1.7-2.8.2-1-2.6L3.7 14l.7-2.7-.7-2.7 2.3-1.6 1-2.6 2.8.2z" /><path d="m9 12 2 2 4-4" /></svg>;
export const IconLeaf = (p: IconProps) => <svg {...base(p)}><path d="M20 4C10 4 5 8 5 14a5 5 0 0 0 5 5c6 0 10-5 10-15Z" /><path d="M4 20c3-4 6-6 10-8" /></svg>;
export const IconClock = (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const IconPlus = (p: IconProps) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const IconClose = (p: IconProps) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const IconChevron = (p: IconProps) => <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>;
export const IconDownload = (p: IconProps) => <svg {...base(p)}><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" /></svg>;
export const IconWhatsapp = (p: IconProps) => <svg {...base(p)}><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a6 6 0 0 1-3-3l1-1-1-2h-1.5z" /></svg>;

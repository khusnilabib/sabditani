'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { IconClose } from './Icons';

/** Lapisan menu bersama: Escape, klik luar, kunci scroll, dan fokus awal. */
export function Drawer({
  open,
  onClose,
  label,
  variant = 'site',
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant?: 'site' | 'app';
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = [...panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select, input')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    const timer = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('a, button')?.focus(), 20);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`drawer-layer drawer-layer--${variant}`}>
      <button type="button" className="drawer-scrim" onClick={onClose} aria-label="Tutup menu" />
      <div ref={panel} className={`drawer-panel drawer-panel--${variant}`} role="dialog" aria-modal="true" aria-label={label}>
        <button type="button" className="drawer-close icon-btn" onClick={onClose} aria-label="Tutup menu">
          <IconClose />
        </button>
        {children}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupLabels, searchGroups, searchIndex, searchItems, type SearchItem } from '@sabditani/core';
import { IconSearch, IconClose } from './Icons';

export function SearchLauncher({ variant = 'site' }: { variant?: 'site' | 'app' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
    else setQuery('');
  }, [open]);

  const results = useMemo(() => searchItems(searchIndex, query, 16), [query]);

  const go = (item: SearchItem) => {
    setOpen(false);
    router.push(item.url);
  };

  return (
    <>
      <button
        type="button"
        className={variant === 'app' ? 'icon-btn' : 'btn btn-secondary btn-small search-trigger'}
        onClick={() => setOpen(true)}
        aria-label="Buka pencarian"
      >
        <IconSearch />
        {variant === 'site' && <span className="search-trigger-label">Cari <kbd>⌘K</kbd></span>}
      </button>
      {open && (
        <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="palette" role="dialog" aria-modal="true" aria-label="Pencarian cepat">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconSearch style={{ marginLeft: 16, width: 20, height: 20, color: 'var(--ink-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                placeholder="Cari panduan, komoditas, hama, atau alat…"
                onChange={(event) => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
                  if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
                  if (event.key === 'Enter' && results[active]) go(results[active]);
                }}
              />
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Tutup pencarian"><IconClose /></button>
            </div>
            <div className="palette-results">
              {results.length === 0 ? (
                <div className="palette-empty">Belum ada hasil. Coba kata kunci lain, misalnya “pupuk” atau “cabai”.</div>
              ) : searchGroups.map((group) => {
                const items = results.filter((item) => item.type === group);
                if (!items.length) return null;
                return (
                  <div key={group}>
                    <div className="palette-group">{groupLabels[group]}</div>
                    {items.map((item) => {
                      const index = results.indexOf(item);
                      return (
                        <button
                          key={`${item.type}-${item.url}`}
                          className={`palette-item${index === active ? ' active' : ''}`}
                          onClick={() => go(item)}
                          onMouseEnter={() => setActive(index)}
                          style={{ width: '100%', textAlign: 'left', border: 0, background: 'transparent' }}
                        >
                          <strong>{item.title}</strong><span>{item.summary}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

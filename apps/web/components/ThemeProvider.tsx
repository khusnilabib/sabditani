'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Season } from '@sabditani/core';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  season: Season;
  setSeason: (season: Season) => void;
  fontScale: number;
  setFontScale: (value: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [season, setSeasonState] = useState<Season>('transition');
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('sd-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light');
    setSeasonState((localStorage.getItem('sd-season') as Season) || 'transition');
    setFontScaleState(Number(localStorage.getItem('sd-font-scale')) || 1);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
    localStorage.setItem('sd-season', season);
  }, [season]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    localStorage.setItem('sd-font-scale', String(fontScale));
  }, [fontScale]);

  const toggle = useCallback(() => {
    setMode((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sd-theme', next);
      return next;
    });
  }, []);

  const setSeason = useCallback((value: Season) => setSeasonState(value), []);
  const setFontScale = useCallback((value: number) => setFontScaleState(value), []);

  return (
    <ThemeContext.Provider value={{ mode, toggle, season, setSeason, fontScale, setFontScale }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}

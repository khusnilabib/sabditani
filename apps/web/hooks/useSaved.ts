'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SavedItem {
  id: string;
  type: 'pupuk' | 'populasi' | 'usaha' | 'panduan';
  title: string;
  detail: string;
  createdAt: string;
  url?: string;
}

export function useSaved() {
  const [items, setItems, ready] = useLocalStorage<SavedItem[]>('sd-saved', []);
  const add = useCallback((item: Omit<SavedItem, 'createdAt'>) => {
    setItems((current) => [{ ...item, createdAt: new Date().toISOString() }, ...current.filter((i) => i.id !== item.id)]);
  }, [setItems]);
  const remove = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), [setItems]);
  const clear = useCallback(() => setItems([]), [setItems]);
  return { items, add, remove, clear, ready };
}

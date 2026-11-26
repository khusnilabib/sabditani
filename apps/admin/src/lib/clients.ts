import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = process.env as Record<string, string | undefined>;

export const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const apiUrl = (env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
export const isBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isBackendConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export interface ApiError extends Error { status: number }

export async function apiRequest<T = unknown>(path: string, init: RequestInit, token?: string): Promise<T> {
  if (!apiUrl) throw new Error('API belum dikonfigurasi.');
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const error = new Error(`Permintaan gagal (${response.status})`) as ApiError;
    error.status = response.status;
    throw error;
  }
  return (await response.json()) as T;
}

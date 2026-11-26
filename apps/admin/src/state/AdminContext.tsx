import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import {
  commodities as seedCrops, pests as seedPests, type ArticleDraft, type Commodity, type Pest,
} from '@sabditani/core';
import { apiRequest, isBackendConfigured, supabase } from '../lib/clients';
import { keys, readJson, removeKey, writeJson } from '../lib/storage';

export interface Session { email: string; role: 'admin' | 'editor'; token?: string; demo: boolean }
export interface MediaItem { id: string; uri: string; thumbUri?: string; name: string; createdAt: string; uploaded: boolean }
export interface OutboxItem { id: string; type: 'article' | 'media' | 'publish'; refId: string; createdAt: string; attempts: number }
export interface BuildStatus { status: 'idle' | 'queued' | 'success' | 'failed'; at?: string; message?: string }
export interface AdminSettings { biometric: boolean; autoSync: boolean }

interface AdminContextValue {
  ready: boolean;
  session: Session | null;
  locked: boolean;
  online: boolean;
  drafts: ArticleDraft[];
  media: MediaItem[];
  outbox: OutboxItem[];
  build: BuildStatus;
  crops: Commodity[];
  pestsList: Pest[];
  settings: AdminSettings;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  unlock: () => Promise<void>;
  createDraft: () => string;
  updateDraft: (id: string, patch: Partial<ArticleDraft>) => void;
  deleteDraft: (id: string) => void;
  publishDraft: (id: string) => Promise<void>;
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt' | 'uploaded'>) => void;
  syncNow: () => Promise<void>;
  saveCrop: (crop: Commodity) => void;
  savePest: (pest: Pest) => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  exportBackup: () => string;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const stamp = () => new Date().toISOString();
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function seedDrafts(): ArticleDraft[] {
  const now = stamp();
  return [
    {
      id: 'draft-contoh-1',
      title: 'Catatan lapangan: kutu keputih pada cabai',
      slug: 'catatan-lapangan-kutu-keputih',
      summary: 'Pengamatan singkat dari kebun cabai: daun menggulung dan bintik putih ditemukan di dua bedengan.',
      bodyMd: '## Pengamatan\n\nDitemukan daun menggulung dan kotoran hitam pada dua bedengan cabai.\n\n:::catatan\nCatatan Lapangan: Kebun cabai, November 2026. Kondisi kanopi lembap setelah hujan dua hari berturut-turut.\n:::\n\n## Tindakan awal\n\n1. Pasang perangkap kuning lengket.\n2. Bersihkan gulma di sekitar bedengan.\n3. Amati selama tiga hari sebelum memutuskan pengendalian.',
      category: 'hama-penyakit', commodityId: 'cabai', status: 'draft', fieldVerified: true,
      coverAlt: 'Daun cabai dengan bintik putih', seoTitle: 'Kutu Keputih pada Cabai', seoDesc: 'Catatan lapangan dan pengendalian awal kutu keputih pada cabai.',
      version: 1, updatedAt: now, syncState: 'local', mediaUris: [],
    },
    {
      id: 'draft-contoh-2',
      title: 'Pemupukan susulan jagung manis',
      slug: 'pemupukan-susulan-jagung-manis',
      summary: 'Rencana aplikasi urea kedua pada jagung manis umur 21 hari.',
      bodyMd: '## Rencana\n\nAplikasi urea susulan pada 21 hari setelah tanam dengan dosis sesuai analisis tanah.\n\n[[hitung:pupuk]]',
      category: 'pemupukan', commodityId: 'jagung', status: 'scheduled', fieldVerified: false,
      coverAlt: 'Tanaman jagung manis', seoTitle: 'Pemupukan Jagung Manis', seoDesc: 'Waktu dan dosis pemupukan susulan jagung manis.',
      version: 2, updatedAt: now, syncState: 'synced', mediaUris: [],
    },
    {
      id: 'draft-contoh-3',
      title: 'Panduan panen cabai yang matang merata',
      slug: 'panen-cabai-matang-merata',
      summary: 'Ciri buah cabai siap panen dan cara menjaga kualitas setelah dipetik.',
      bodyMd: '## Ciri matang\n\nBuah merah penuh, kulit mengkilap, dan tangkai masih segar.\n\n## Penanganan\n\nPetik pagi hari setelah embun kering. Gunakan wadah berlubang.',
      category: 'pascapanen', commodityId: 'cabai', status: 'published', fieldVerified: true,
      coverAlt: 'Buah cabai merah siap panen', seoTitle: 'Panen Cabai Matang Merata', seoDesc: 'Ciri dan penanganan panen cabai.',
      version: 3, updatedAt: now, syncState: 'synced', mediaUris: [],
    },
  ];
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [locked, setLocked] = useState(false);
  const [online, setOnline] = useState(true);
  const [drafts, setDrafts] = useState<ArticleDraft[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [build, setBuild] = useState<BuildStatus>({ status: 'idle' });
  const [crops, setCrops] = useState<Commodity[]>(seedCrops);
  const [pestsList, setPestsList] = useState<Pest[]>(seedPests);
  const [settings, setSettings] = useState<AdminSettings>({ biometric: false, autoSync: true });

  useEffect(() => {
    (async () => {
      const [savedSession, savedDrafts, savedMedia, savedCrops, savedPests, savedSettings, savedOutbox] = await Promise.all([
        readJson<Session | null>(keys.session, null),
        readJson<ArticleDraft[] | null>(keys.drafts, null),
        readJson<MediaItem[]>(keys.media, []),
        readJson<Commodity[]>(keys.crops, seedCrops),
        readJson<Pest[]>(keys.pests, seedPests),
        readJson<AdminSettings>(keys.settings, { biometric: false, autoSync: true }),
        readJson<OutboxItem[]>(keys.outbox, []),
      ]);
      setSession(savedSession);
      setDrafts(savedDrafts ?? (savedSession ? seedDrafts() : []));
      setMedia(savedMedia);
      setCrops(savedCrops);
      setPestsList(savedPests);
      setSettings(savedSettings);
      setOutbox(savedOutbox);
      if (savedSession && savedSettings.biometric) setLocked(true);
      setReady(true);
    })();
    const unsubscribe = NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected)));
    return unsubscribe;
  }, []);

  const persistDrafts = useCallback(async (next: ArticleDraft[]) => {
    setDrafts(next);
    await writeJson(keys.drafts, next);
  }, []);

  const enqueue = useCallback(async (item: Omit<OutboxItem, 'id' | 'createdAt' | 'attempts'>) => {
    setOutbox((current) => {
      const next = [...current, { ...item, id: uid(), createdAt: stamp(), attempts: 0 }];
      void writeJson(keys.outbox, next);
      return next;
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email.includes('@') || password.length < 6) throw new Error('Masukkan email yang valid dan kata sandi minimal 6 karakter.');
    let next: Session;
    if (isBackendConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) throw new Error(error?.message ?? 'Masuk gagal. Periksa email dan kata sandi Anda.');
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      const role = profile?.role === 'admin' || profile?.role === 'editor' ? profile.role : null;
      if (!role) throw new Error('Akun Anda tidak memiliki peran staf.');
      next = { email, role, token: data.session?.access_token, demo: false };
      if (data.session?.access_token) await SecureStore.setItemAsync('sd-admin-token', data.session.access_token);
    } else {
      next = { email, role: 'admin', demo: true };
    }
    setSession(next);
    await writeJson(keys.session, next);
    if (!drafts.length) await persistDrafts(seedDrafts());
    setLocked(false);
  }, [drafts.length, persistDrafts]);

  const signOut = useCallback(async () => {
    try { await supabase?.auth.signOut(); } catch { /* abaikan */ }
    try { await SecureStore.deleteItemAsync('sd-admin-token'); } catch { /* abaikan */ }
    await Promise.all([removeKey(keys.session), removeKey(keys.drafts), removeKey(keys.media), removeKey(keys.outbox), removeKey(keys.crops), removeKey(keys.pests)]);
    setSession(null); setLocked(false); setDrafts([]); setMedia([]); setOutbox([]);
    setCrops(seedCrops); setPestsList(seedPests); setBuild({ status: 'idle' });
  }, []);

  const unlock = useCallback(async () => {
    const enrolled = await LocalAuthentication.hasHardwareAsync().then((has) => has && LocalAuthentication.isEnrolledAsync());
    if (!enrolled || settings.biometric === false) { setLocked(false); return; }
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Buka SABDITANI Admin', fallbackLabel: 'Gunakan PIN perangkat' });
    if (result.success) setLocked(false);
  }, [settings.biometric]);

  const createDraft = useCallback(() => {
    const draft: ArticleDraft = {
      id: uid(), title: '', slug: '', summary: '', bodyMd: '', category: 'budidaya', commodityId: 'cabai',
      status: 'draft', fieldVerified: false, coverAlt: '', seoTitle: '', seoDesc: '', version: 1,
      updatedAt: stamp(), syncState: 'local', mediaUris: [],
    };
    void persistDrafts([draft, ...drafts]);
    void enqueue({ type: 'article', refId: draft.id });
    return draft.id;
  }, [drafts, enqueue, persistDrafts]);

  const updateDraft = useCallback((id: string, patch: Partial<ArticleDraft>) => {
    const next = drafts.map((draft) => draft.id === id
      ? { ...draft, ...patch, updatedAt: stamp(), version: patch.version ?? draft.version, syncState: 'local' as const }
      : draft);
    void persistDrafts(next);
    if (!outbox.some((item) => item.type === 'article' && item.refId === id)) {
      void enqueue({ type: 'article', refId: id });
    }
  }, [drafts, enqueue, outbox, persistDrafts]);

  const deleteDraft = useCallback((id: string) => {
    void persistDrafts(drafts.filter((draft) => draft.id !== id));
  }, [drafts, persistDrafts]);

  const publishDraft = useCallback(async (id: string) => {
    const draft = drafts.find((item) => item.id === id);
    if (!draft) return;
    await persistDrafts(drafts.map((item) => item.id === id ? { ...item, status: 'published', syncState: 'syncing' } : item));
    await enqueue({ type: 'publish', refId: id });
    setBuild({ status: 'queued', at: stamp(), message: 'Sedang membangun situs. Biasanya 2–4 menit.' });
    if (isBackendConfigured && session?.token) {
      try {
        await apiRequest('/v1/publish', { method: 'POST', body: JSON.stringify({ articleId: id }) }, session.token);
      } catch (error) {
        setBuild({ status: 'failed', at: stamp(), message: error instanceof Error ? error.message : 'Gagal memicu build.' });
        return;
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1600));
    }
    setBuild({ status: 'success', at: stamp(), message: 'Situs berhasil diperbarui.' });
    await persistDrafts(drafts.map((item) => item.id === id ? { ...item, syncState: 'synced' } : item));
  }, [drafts, enqueue, persistDrafts, session?.token]);

  const addMedia = useCallback((item: Omit<MediaItem, 'id' | 'createdAt' | 'uploaded'>) => {
    const next = [{ ...item, id: uid(), createdAt: stamp(), uploaded: false }, ...media];
    setMedia(next);
    void writeJson(keys.media, next);
    void enqueue({ type: 'media', refId: item.uri });
  }, [enqueue, media]);

  const syncNow = useCallback(async () => {
    if (!online && isBackendConfigured) return;
    if (!isBackendConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await persistDrafts(drafts.map((item) => ({ ...item, syncState: 'synced' })));
      const nextMedia = media.map((item) => ({ ...item, uploaded: true }));
      setMedia(nextMedia);
      await writeJson(keys.media, nextMedia);
      setOutbox([]);
      await writeJson(keys.outbox, []);
      return;
    }
    // Dengan backend nyata, antrean dikirim ke Worker. Kegagalan membuat item tetap di antrean.
    const remaining: OutboxItem[] = [];
    for (const item of outbox) {
      try {
        if (item.type === 'publish' && session?.token) {
          await apiRequest('/v1/publish', { method: 'POST', body: JSON.stringify({ articleId: item.refId }) }, session.token);
        }
      } catch {
        remaining.push({ ...item, attempts: item.attempts + 1 });
      }
    }
    setOutbox(remaining);
    await writeJson(keys.outbox, remaining);
  }, [drafts, media, online, outbox, persistDrafts, session?.token]);

  const saveCrop = useCallback((crop: Commodity) => {
    const next = crops.some((item) => item.id === crop.id) ? crops.map((item) => item.id === crop.id ? crop : item) : [crop, ...crops];
    setCrops(next); void writeJson(keys.crops, next);
  }, [crops]);

  const savePest = useCallback((pest: Pest) => {
    const next = pestsList.some((item) => item.id === pest.id) ? pestsList.map((item) => item.id === pest.id ? pest : item) : [pest, ...pestsList];
    setPestsList(next); void writeJson(keys.pests, next);
  }, [pestsList]);

  const updateSettings = useCallback((patch: Partial<AdminSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void writeJson(keys.settings, next);
      return next;
    });
  }, []);

  const exportBackup = useCallback(() => JSON.stringify({ version: 1, exportedAt: stamp(), drafts, media, crops, pests: pestsList }, null, 2), [crops, drafts, media, pestsList]);

  const value = useMemo<AdminContextValue>(() => ({
    ready, session, locked, online, drafts, media, outbox, build, crops, pestsList, settings,
    signIn, signOut, unlock, createDraft, updateDraft, deleteDraft, publishDraft, addMedia, syncNow,
    saveCrop, savePest, updateSettings, exportBackup,
  }), [build, crops, createDraft, deleteDraft, drafts, exportBackup, locked, media, online, outbox, pestsList, publishDraft, ready, saveCrop, savePest, session, settings, signIn, signOut, syncNow, unlock, updateDraft, updateSettings]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin harus dipakai di dalam AdminProvider');
  return value;
}

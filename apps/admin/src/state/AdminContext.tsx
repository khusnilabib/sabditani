import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import {
  commodities as seedCrops, pests as seedPests, type ArticleDraft, type Commodity, type Pest,
} from '@sabditani/core';
import { apiRequest, isBackendConfigured, supabase } from '../lib/clients';
import { keys, readJson, removeKey, writeJson } from '../lib/storage';

export interface Session { email: string; role: 'admin' | 'editor'; token?: string; refreshToken?: string; userId?: string }
export interface MediaItem {
  id: string; uri: string; thumbUri?: string; name: string; createdAt: string; uploaded: boolean;
  articleId?: string; remoteUrl?: string; thumbUrl?: string;
}
export interface OutboxItem { id: string; type: 'article' | 'media' | 'publish'; refId: string; createdAt: string; attempts: number }
export interface BuildStatus { status: 'idle' | 'queued' | 'success' | 'failed'; at?: string; message?: string }
export interface AdminSettings { biometric: boolean; autoSync: boolean }

type ResolveChoice = 'mine' | 'theirs' | 'both';
type Taxonomy = { category: Record<string, number>; commodity: Record<string, number> };

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
  conflicts: Record<string, ArticleDraft>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  unlock: () => Promise<void>;
  createDraft: () => string;
  updateDraft: (id: string, patch: Partial<ArticleDraft>) => void;
  deleteDraft: (id: string) => void;
  publishDraft: (id: string) => Promise<void>;
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt' | 'uploaded'>) => void;
  syncNow: () => Promise<void>;
  resolveConflict: (id: string, choice: ResolveChoice) => Promise<void>;
  saveCrop: (crop: Commodity) => void;
  savePest: (pest: Pest) => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  exportBackup: () => string;
}

const AdminContext = createContext<AdminContextValue | null>(null);
const stamp = () => new Date().toISOString();
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
  const r = Math.floor(Math.random() * 16);
  return (char === 'x' ? r : (r & 0x3) | 0x8).toString(16);
});
const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'draft';

function seedDrafts(): ArticleDraft[] {
  const now = stamp();
  return [
    {
      id: 'draft-contoh-1',
      title: 'Catatan lapangan: kutu keputih pada cabai',
      slug: 'catatan-lapangan-kutu-keputih',
      summary: 'Pengamatan singkat dari kebun cabai: daun menggulung dan bintik putih ditemukan di dua bedengan.',
      bodyMd: '## Pengamatan\n\nDitemukan daun menggulung dan kotoran hitam pada dua bedengan cabai.\n\n:::catatan\nCatatan Lapangan: Kebun cabai, November 2026.\n:::\n\n## Tindakan awal\n\n1. Pasang perangkap kuning lengket.\n2. Bersihkan gulma.\n3. Amati selama tiga hari.',
      category: 'hama-penyakit', commodityId: 'cabai', status: 'draft', fieldVerified: false,
      coverAlt: 'Daun cabai dengan bintik putih', seoTitle: 'Kutu Keputih pada Cabai', seoDesc: 'Catatan lapangan kutu keputih pada cabai.',
      version: 1, updatedAt: now, syncState: 'local', mediaUris: [],
    },
  ];
}

interface ArticleRow {
  id: string; title: string; slug: string; summary: string | null; body_md: string;
  category_id: number | null; commodity_id: number | null; status: string; field_verified: boolean;
  cover_url: string | null; cover_alt: string | null; seo_title: string | null; seo_desc: string | null;
  version: number; updated_at: string;
}

const rowToDraft = (row: ArticleRow, taxonomy: Taxonomy): ArticleDraft => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  summary: row.summary ?? '',
  bodyMd: row.body_md ?? '',
  category: Object.entries(taxonomy.category).find(([, id]) => id === row.category_id)?.[0] ?? 'budidaya',
  commodityId: Object.entries(taxonomy.commodity).find(([, id]) => id === row.commodity_id)?.[0] ?? 'cabai',
  status: row.status === 'published' || row.status === 'scheduled' ? row.status : 'draft',
  fieldVerified: Boolean(row.field_verified),
  coverAlt: row.cover_alt ?? '',
  seoTitle: row.seo_title ?? '',
  seoDesc: row.seo_desc ?? '',
  version: row.version,
  updatedAt: row.updated_at,
  syncState: 'synced',
  mediaUris: row.cover_url ? [row.cover_url] : [],
});

const draftToRow = (draft: ArticleDraft, taxonomy: Taxonomy, authorId: string | undefined, coverUrl?: string) => ({
  title: draft.title.trim() || 'Draf tanpa judul',
  slug: draft.slug.trim() || slugify(draft.title),
  summary: draft.summary || null,
  body_md: draft.bodyMd || '',
  category_id: taxonomy.category[draft.category] ?? null,
  commodity_id: taxonomy.commodity[draft.commodityId] ?? null,
  author_id: authorId ?? null,
  status: draft.status,
  field_verified: draft.fieldVerified,
  cover_url: coverUrl ?? null,
  cover_alt: draft.coverAlt || null,
  seo_title: draft.seoTitle || null,
  seo_desc: draft.seoDesc || null,
  published_at: draft.status === 'published' ? stamp() : null,
});

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
  const [conflicts, setConflicts] = useState<Record<string, ArticleDraft>>({});
  const [taxonomy, setTaxonomy] = useState<Taxonomy>({ category: {}, commodity: {} });

  const draftsRef = useRef(drafts);
  const mediaRef = useRef(media);
  const outboxRef = useRef(outbox);
  useEffect(() => { draftsRef.current = drafts; }, [drafts]);
  useEffect(() => { mediaRef.current = media; }, [media]);
  useEffect(() => { outboxRef.current = outbox; }, [outbox]);

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
      setDrafts(savedDrafts ?? []);
      setMedia(savedMedia);
      setCrops(savedCrops);
      setPestsList(savedPests);
      setSettings(savedSettings);
      setOutbox(savedOutbox);
      if (savedSession && savedSettings.biometric) setLocked(true);

      if (savedSession?.refreshToken && supabase) {
        try {
          const { error } = await supabase.auth.setSession({ access_token: savedSession.token ?? '', refresh_token: savedSession.refreshToken });
          if (!error) {
            const [cats, coms] = await Promise.all([
              supabase.from('categories').select('slug, id'),
              supabase.from('commodities').select('slug, id'),
            ]);
            setTaxonomy({
              category: Object.fromEntries((cats.data ?? []).map((row: { slug: string; id: number }) => [row.slug, row.id])),
              commodity: Object.fromEntries((coms.data ?? []).map((row: { slug: string; id: number }) => [row.slug, row.id])),
            });
          }
        } catch { /* sesi akan diminta masuk ulang */ }
      }
      setReady(true);
    })();
    const unsubscribe = NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected)));
    return unsubscribe;
  }, []);

  const persistDrafts = useCallback(async (next: ArticleDraft[]) => {
    draftsRef.current = next;
    setDrafts(next);
    await writeJson(keys.drafts, next);
  }, []);

  const persistMedia = useCallback(async (next: MediaItem[]) => {
    mediaRef.current = next;
    setMedia(next);
    await writeJson(keys.media, next);
  }, []);

  const persistOutbox = useCallback(async (next: OutboxItem[]) => {
    outboxRef.current = next;
    setOutbox(next);
    await writeJson(keys.outbox, next);
  }, []);

  const enqueue = useCallback(async (item: Omit<OutboxItem, 'id' | 'createdAt' | 'attempts'>) => {
    await persistOutbox([...outboxRef.current, { ...item, id: uid(), createdAt: stamp(), attempts: 0 }]);
  }, [persistOutbox]);

  const loadTaxonomy = useCallback(async () => {
    if (!supabase) return { category: {}, commodity: {} };
    const [cats, coms] = await Promise.all([
      supabase.from('categories').select('slug, id'),
      supabase.from('commodities').select('slug, id'),
    ]);
    const next = {
      category: Object.fromEntries((cats.data ?? []).map((row: { slug: string; id: number }) => [row.slug, row.id])),
      commodity: Object.fromEntries((coms.data ?? []).map((row: { slug: string; id: number }) => [row.slug, row.id])),
    };
    setTaxonomy(next);
    return next;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isBackendConfigured || !supabase) throw new Error('Supabase belum dikonfigurasi. Hubungi admin proyek.');
    if (!email.includes('@') || password.length < 8) throw new Error('Masukkan email yang valid dan kata sandi minimal 8 karakter.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) throw new Error(error?.message ?? 'Masuk gagal. Periksa email dan kata sandi Anda.');
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    const role = profile?.role === 'admin' || profile?.role === 'editor' ? profile.role : null;
    if (!role) throw new Error('Akun Anda tidak memiliki peran staf.');

    const next: Session = {
      email, role, userId: data.user.id,
      token: data.session.access_token, refreshToken: data.session.refresh_token,
    };
    await Promise.all([
      SecureStore.setItemAsync('sd-admin-token', data.session.access_token),
      SecureStore.setItemAsync('sd-admin-refresh', data.session.refresh_token),
    ]);
    setSession(next);
    await writeJson(keys.session, next);

    const maps = await loadTaxonomy();
    const { data: rows } = await supabase.from('articles').select('*').order('updated_at', { ascending: false });
    const remote = ((rows ?? []) as ArticleRow[]).map((row) => rowToDraft(row, maps));
    const localUnsynced = draftsRef.current.filter((item) => item.syncState === 'local' || item.syncState === 'conflict');
    await persistDrafts([...localUnsynced, ...remote.filter((item) => !localUnsynced.some((local) => local.id === item.id))]);
    setLocked(false);
  }, [loadTaxonomy, persistDrafts]);

  const signOut = useCallback(async () => {
    try { await supabase?.auth.signOut(); } catch { /* abaikan */ }
    await Promise.all([
      SecureStore.deleteItemAsync('sd-admin-token').catch(() => {}),
      SecureStore.deleteItemAsync('sd-admin-refresh').catch(() => {}),
      removeKey(keys.session), removeKey(keys.drafts), removeKey(keys.media), removeKey(keys.outbox),
      removeKey(keys.crops), removeKey(keys.pests),
    ]);
    setSession(null); setLocked(false); setDrafts([]); setMedia([]); setOutbox([]); setConflicts({});
    setCrops(seedCrops); setPestsList(seedPests); setBuild({ status: 'idle' });
    draftsRef.current = []; mediaRef.current = []; outboxRef.current = [];
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
    void persistDrafts([draft, ...draftsRef.current]);
    void enqueue({ type: 'article', refId: draft.id });
    return draft.id;
  }, [enqueue, persistDrafts]);

  const updateDraft = useCallback((id: string, patch: Partial<ArticleDraft>) => {
    const next = draftsRef.current.map((draft) => draft.id === id
      ? { ...draft, ...patch, updatedAt: stamp(), syncState: 'local' as const }
      : draft);
    void persistDrafts(next);
    if (!outboxRef.current.some((item) => item.type === 'article' && item.refId === id)) {
      void enqueue({ type: 'article', refId: id });
    }
  }, [enqueue, persistDrafts]);

  const deleteDraft = useCallback((id: string) => {
    void persistDrafts(draftsRef.current.filter((draft) => draft.id !== id));
    if (isUuid(id) && supabase) {
      void supabase.from('articles').delete().eq('id', id).then(({ error }) => {
        if (error) void enqueue({ type: 'article', refId: id });
      });
    }
  }, [enqueue, persistDrafts]);

  const syncOneArticle = useCallback(async (id: string): Promise<'ok' | 'conflict' | 'error'> => {
    const draft = draftsRef.current.find((item) => item.id === id);
    if (!draft || !supabase) return 'error';
    const maps = Object.keys(taxonomy.category).length ? taxonomy : await loadTaxonomy();
    const cover = mediaRef.current.find((item) => item.articleId === id && item.uploaded)?.remoteUrl;
    const payload = draftToRow(draft, maps, session?.userId, cover);

    if (!isUuid(draft.id)) {
      const newId = uuid();
      const { data, error } = await supabase.from('articles').insert({ ...payload, id: newId, version: 1 }).select('*').single();
      if (error || !data) return 'error';
      const saved = rowToDraft(data as ArticleRow, maps);
      await persistDrafts(draftsRef.current.map((item) => item.id === id ? saved : item));
      const nextOutbox = outboxRef.current.map((item) => item.refId === id ? { ...item, refId: newId } : item);
      await persistOutbox(nextOutbox);
      const nextConflicts = { ...conflicts };
      if (nextConflicts[id]) { nextConflicts[newId] = nextConflicts[id]; delete nextConflicts[id]; setConflicts(nextConflicts); }
      return 'ok';
    }

    const { data, error } = await supabase.from('articles')
      .update(payload).eq('id', draft.id).eq('version', draft.version).select('*');
    if (error) return 'error';
    if (!data?.length) {
      const { data: remote } = await supabase.from('articles').select('*').eq('id', draft.id).maybeSingle();
      if (remote) setConflicts((current) => ({ ...current, [draft.id]: rowToDraft(remote as ArticleRow, maps) }));
      await persistDrafts(draftsRef.current.map((item) => item.id === id ? { ...item, syncState: 'conflict' } : item));
      return 'conflict';
    }
    const saved = rowToDraft(data[0] as ArticleRow, maps);
    setConflicts((current) => { const next = { ...current }; delete next[id]; return next; });
    await persistDrafts(draftsRef.current.map((item) => item.id === id ? saved : item));
    return 'ok';
  }, [conflicts, loadTaxonomy, persistDrafts, persistOutbox, session?.userId, taxonomy]);

  const syncOneMedia = useCallback(async (id: string): Promise<boolean> => {
    if (!session?.token) return false;
    const item = mediaRef.current.find((entry) => entry.uri === id);
    if (!item || !item.thumbUri) return false;
    const form = new FormData();
    const base = `article-${item.articleId ?? item.id}`;
    form.append('file', { uri: item.uri, name: `${base}.webp`, type: 'image/webp' } as unknown as Blob);
    form.append('file', { uri: item.thumbUri, name: `${base}_480.webp`, type: 'image/webp' } as unknown as Blob);
    const result = await apiRequest<{ items: { url: string; thumbUrl?: string }[] }>(
      '/v1/media', { method: 'POST', body: form }, session.token
    );
    const uploaded = result.items?.[0];
    if (!uploaded) return false;
    await persistMedia(mediaRef.current.map((entry) => entry.uri === id
      ? { ...entry, uploaded: true, remoteUrl: uploaded.url, thumbUrl: uploaded.thumbUrl }
      : entry));
    return true;
  }, [persistMedia, session?.token]);

  const syncNow = useCallback(async () => {
    if (!online) return;
    if (!session?.token || !supabase) return;
    const queue = [...outboxRef.current];
    const remaining: OutboxItem[] = [];
    for (const item of queue) {
      try {
        if (item.type === 'article') {
          const result = await syncOneArticle(item.refId);
          if (result !== 'ok') remaining.push({ ...item, attempts: item.attempts + 1 });
        } else if (item.type === 'media') {
          const ok = await syncOneMedia(item.refId);
          if (!ok) remaining.push({ ...item, attempts: item.attempts + 1 });
        } else if (item.type === 'publish') {
          await apiRequest('/v1/publish', { method: 'POST', body: JSON.stringify({ articleId: item.refId }) }, session.token);
          setBuild({ status: 'success', at: stamp(), message: 'Situs berhasil diperbarui.' });
        }
      } catch {
        remaining.push({ ...item, attempts: item.attempts + 1 });
      }
    }
    await persistOutbox(remaining);
  }, [online, persistOutbox, session?.token, syncOneArticle, syncOneMedia]);

  useEffect(() => {
    if (!ready || !session || !online || !settings.autoSync || !outbox.length) return;
    const timer = setTimeout(() => { void syncNow(); }, 1500);
    return () => clearTimeout(timer);
  }, [online, outbox.length, ready, session, settings.autoSync, syncNow]);

  const publishDraft = useCallback(async (id: string) => {
    const draft = draftsRef.current.find((item) => item.id === id);
    if (!draft) return;
    await persistDrafts(draftsRef.current.map((item) => item.id === id ? { ...item, status: 'published' } : item));
    const sync = await syncOneArticle(id);
    if (sync !== 'ok') {
      setBuild({ status: 'failed', at: stamp(), message: sync === 'conflict' ? 'Ada versi lebih baru di server. Selesaikan konflik dulu.' : 'Gagal menyimpan artikel ke server.' });
      return;
    }
    setBuild({ status: 'queued', at: stamp(), message: 'Sedang membangun situs. Biasanya 2–4 menit.' });
    try {
      if (session?.token) await apiRequest('/v1/publish', { method: 'POST', body: JSON.stringify({ articleId: id }) }, session.token);
      setBuild({ status: 'success', at: stamp(), message: 'Permintaan terbit dikirim. Cek status build di beranda.' });
    } catch (error) {
      await enqueue({ type: 'publish', refId: id });
      setBuild({ status: 'failed', at: stamp(), message: error instanceof Error ? error.message : 'Gagal memicu build.' });
    }
  }, [enqueue, persistDrafts, session?.token, syncOneArticle]);

  const addMedia = useCallback((item: Omit<MediaItem, 'id' | 'createdAt' | 'uploaded'>) => {
    const next = [{ ...item, id: uid(), createdAt: stamp(), uploaded: false }, ...mediaRef.current];
    void persistMedia(next);
    void enqueue({ type: 'media', refId: item.uri });
  }, [enqueue, persistMedia]);

  const resolveConflict = useCallback(async (id: string, choice: ResolveChoice) => {
    const remote = conflicts[id];
    const local = draftsRef.current.find((item) => item.id === id);
    if (!remote || !local) return;
    if (choice === 'theirs') {
      await persistDrafts(draftsRef.current.map((item) => item.id === id ? remote : item));
      setConflicts((current) => { const next = { ...current }; delete next[id]; return next; });
      return;
    }
    if (choice === 'mine') {
      await persistDrafts(draftsRef.current.map((item) => item.id === id ? { ...item, version: remote.version, syncState: 'local' } : item));
      await enqueue({ type: 'article', refId: id });
      return;
    }
    const copy: ArticleDraft = {
      ...local, id: uuid(), slug: `${local.slug || slugify(local.title)}-salinan-${uid().slice(-4)}`,
      title: `${local.title || 'Draf tanpa judul'} (salinan)`, version: 1, syncState: 'local',
    };
    await persistDrafts([copy, ...draftsRef.current.map((item) => item.id === id ? remote : item)]);
    await enqueue({ type: 'article', refId: copy.id });
    setConflicts((current) => { const next = { ...current }; delete next[id]; return next; });
  }, [conflicts, enqueue, persistDrafts]);

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
    ready, session, locked, online, drafts, media, outbox, build, crops, pestsList, settings, conflicts,
    signIn, signOut, unlock, createDraft, updateDraft, deleteDraft, publishDraft, addMedia, syncNow,
    resolveConflict, saveCrop, savePest, updateSettings, exportBackup,
  }), [build, conflicts, crops, createDraft, deleteDraft, drafts, exportBackup, locked, media, online, outbox, pestsList,
    publishDraft, ready, resolveConflict, saveCrop, savePest, session, settings, signIn, signOut, syncNow, unlock, updateDraft, updateSettings]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin harus dipakai di dalam AdminProvider');
  return value;
}

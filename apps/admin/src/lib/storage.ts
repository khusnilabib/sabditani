import AsyncStorage from '@react-native-async-storage/async-storage';

export const keys = {
  session: 'sd-admin-session',
  drafts: 'sd-admin-drafts',
  media: 'sd-admin-media',
  crops: 'sd-admin-commodities',
  pests: 'sd-admin-pests',
  settings: 'sd-admin-settings',
  outbox: 'sd-admin-outbox',
};

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan kegagalan penyimpanan */ }
}

export async function removeKey(key: string): Promise<void> {
  try { await AsyncStorage.removeItem(key); } catch { /* abaikan */ }
}

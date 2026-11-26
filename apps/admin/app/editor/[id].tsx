import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Badge, Button, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme, radius } from '../../src/theme';

const c = theme.light.colors;

type Form = {
  title: string; summary: string; bodyMd: string; category: string; commodityId: string;
  coverAlt: string; seoTitle: string; seoDesc: string; fieldVerified: boolean;
};

const toolbar = [
  { label: 'Tebal', insert: '**teks tebal**' },
  { label: 'Miring', insert: '*teks miring*' },
  { label: 'Judul', insert: '## Judul bagian\n' },
  { label: 'Daftar', insert: '- item daftar\n' },
  { label: 'Tautan', insert: '[teks tautan](https://)' },
  { label: 'Catatan Lapangan', insert: ':::catatan\nCatatan Lapangan: \n:::\n' },
  { label: 'Peringatan', insert: ':::peringatan\nPeringatan: \n:::\n' },
  { label: 'Tabel', insert: '| Kolom 1 | Kolom 2 |\n|---|---|\n| isi | isi |\n' },
];

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { drafts, updateDraft, addMedia } = useAdmin();
  const draft = drafts.find((item) => item.id === id);
  const [form, setForm] = useState<Form>({
    title: draft?.title ?? '', summary: draft?.summary ?? '', bodyMd: draft?.bodyMd ?? '',
    category: draft?.category ?? 'budidaya', commodityId: draft?.commodityId ?? 'cabai',
    coverAlt: draft?.coverAlt ?? '', seoTitle: draft?.seoTitle ?? '', seoDesc: draft?.seoDesc ?? '',
    fieldVerified: draft?.fieldVerified ?? false,
  });
  const [preview, setPreview] = useState(false);
  const lastSaved = useRef(JSON.stringify(form));

  useEffect(() => {
    const timer = setTimeout(() => {
      const snapshot = JSON.stringify(form);
      if (snapshot !== lastSaved.current && draft) {
        updateDraft(draft.id, form);
        lastSaved.current = snapshot;
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [form, draft, updateDraft]);

  if (!draft) {
    return <Screen><Text style={{ padding: 24 }}>Artikel tidak ditemukan.</Text></Screen>;
  }

  const set = (key: keyof Form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const insert = (text: string) => setForm((current) => ({ ...current, bodyMd: `${current.bodyMd}${current.bodyMd.endsWith('\n') || !current.bodyMd ? '' : '\n'}${text}` }));

  const addPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    try {
      const compressed = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], { compress: 0.8, format: ImageManipulator.SaveFormat.WEBP });
      addMedia({ uri: compressed.uri, name: `foto-lapangan-${Date.now()}.webp` });
      insert(`\n![Foto lapangan](${compressed.uri})\n`);
    } catch { insert(`\n![Foto lapangan](${uri})\n`); }
  };

  const saveNow = () => { updateDraft(draft.id, form); lastSaved.current = JSON.stringify(form); };

  return (
    <Screen>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22, color: c.primary }}>‹</Text></Pressable>
        <Text style={{ fontSize: 16, fontWeight: '700', flex: 1 }} numberOfLines={1}>{form.title || 'Catatan baru'}</Text>
        <Badge label={draft.syncState === 'local' ? 'Tersimpan lokal' : 'Tersinkron'} tone={draft.syncState === 'local' ? 'warning' : 'success'} />
      </View>

      <View style={styles.segmented}>
        <Pressable onPress={() => setPreview(false)} style={[styles.segment, !preview && styles.segmentActive]}><Text style={[styles.segmentText, !preview && styles.segmentTextActive]}>Tulis</Text></Pressable>
        <Pressable onPress={() => setPreview(true)} style={[styles.segment, preview && styles.segmentActive]}><Text style={[styles.segmentText, preview && styles.segmentTextActive]}>Pratinjau</Text></Pressable>
      </View>

      {preview ? (
        <View style={styles.previewCard}>
          <Text style={{ fontSize: 26, fontWeight: '700' }}>{form.title || 'Tanpa judul'}</Text>
          <Text style={{ fontSize: 14, color: c.inkMuted, marginTop: 8 }}>{form.summary}</Text>
          <View style={{ height: 1, backgroundColor: c.line, marginVertical: 16 }} />
          {form.bodyMd.split('\n').map((line, index) => (
            <Text key={index} style={{ fontSize: line.startsWith('## ') ? 20 : 15, fontWeight: line.startsWith('## ') ? '700' : '400', marginTop: line.startsWith('## ') ? 16 : 4, lineHeight: 24 }}>
              {line.replace(/^##\s+/, '').replace(/^:::.*$/, '')}
            </Text>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {toolbar.map((item) => (
              <Pressable key={item.label} onPress={() => insert(item.insert)} style={styles.toolButton}>
                <Text style={{ color: c.primary, fontSize: 12, fontWeight: '600' }}>{item.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => void addPhoto()} style={styles.toolButton}><Text style={{ color: c.primary, fontSize: 12, fontWeight: '600' }}>Foto</Text></Pressable>
          </View>
        </ScrollView>
      )}

      {!preview && (
        <View style={styles.form}>
          <Text style={styles.label}>Judul</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(value) => set('title', value)} placeholder="Judul artikel" placeholderTextColor={c.inkMuted} />
          <Text style={styles.label}>Ringkasan</Text>
          <TextInput style={[styles.input, { minHeight: 70 }]} multiline value={form.summary} onChangeText={(value) => set('summary', value)} placeholder="Ringkasan satu paragraf" placeholderTextColor={c.inkMuted} />
          <Text style={styles.label}>Isi artikel (Markdown)</Text>
          <TextInput style={[styles.input, styles.body]} multiline value={form.bodyMd} onChangeText={(value) => set('bodyMd', value)} placeholder="Tulis catatan lapangan Anda…" placeholderTextColor={c.inkMuted} textAlignVertical="top" />
          <Text style={styles.hint}>Setiap ketikan disimpan otomatis setiap 5 detik. Status di atas menunjukkan penyimpanan lokal.</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Button title="Simpan" variant="secondary" onPress={saveNow} />
        <View style={{ flex: 1 }}><Button title="Atur penerbitan" onPress={() => { saveNow(); router.push(`/terbitkan/${draft.id}`); }} /></View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  segmented: { flexDirection: 'row', backgroundColor: c.sunken, borderRadius: 10, padding: 4, marginBottom: 14 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  segmentActive: { backgroundColor: c.surface },
  segmentText: { fontSize: 13, color: c.inkMuted, fontWeight: '600' },
  segmentTextActive: { color: c.ink },
  toolButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 8 },
  form: { marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12 },
  input: { minHeight: 48, borderWidth: 1, borderColor: c.line, backgroundColor: c.sunken, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, color: c.ink, fontSize: 15 },
  body: { minHeight: 260, lineHeight: 22 },
  hint: { fontSize: 11, color: c.inkMuted, marginTop: 8, lineHeight: 16 },
  previewCard: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.lg, padding: 18 },
});

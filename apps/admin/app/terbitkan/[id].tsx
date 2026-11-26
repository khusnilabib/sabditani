import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge, Button, Card, Field, Heading, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme } from '../../src/theme';
import { categories, commodities } from '@sabditani/core';

const c = theme.light.colors;

export default function PublishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { drafts, updateDraft, publishDraft, build } = useAdmin();
  const draft = drafts.find((item) => item.id === id);
  const [category, setCategory] = useState(draft?.category ?? 'budidaya');
  const [commodityId, setCommodityId] = useState(draft?.commodityId ?? 'cabai');
  const [coverAlt, setCoverAlt] = useState(draft?.coverAlt ?? '');
  const [seoTitle, setSeoTitle] = useState(draft?.seoTitle ?? '');
  const [seoDesc, setSeoDesc] = useState(draft?.seoDesc ?? '');
  const [fieldVerified, setFieldVerified] = useState(draft?.fieldVerified ?? false);
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [publishing, setPublishing] = useState(false);

  if (!draft) return <Screen><Heading title="Artikel tidak ditemukan" /></Screen>;

  const ready = Boolean(draft.title && draft.summary && draft.bodyMd && coverAlt && seoTitle && seoDesc && seoDesc.length <= 160);

  const publish = async () => {
    setPublishing(true);
    updateDraft(draft.id, {
      category, commodityId, coverAlt, seoTitle, seoDesc, fieldVerified,
      status: schedule === 'now' ? 'published' : 'scheduled',
    });
    if (schedule === 'now') await publishDraft(draft.id);
    setPublishing(false);
    router.back();
  };

  return (
    <Screen>
      <Heading title="Terbitkan" subtitle={draft.title || 'Artikel tanpa judul'} />
      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Daftar periksa</Text>
        <Badge label={draft.title ? 'Judul ✓' : 'Judul belum diisi'} tone={draft.title ? 'success' : 'danger'} />
        <View style={{ height: 8 }} />
        <Badge label={draft.summary ? 'Ringkasan ✓' : 'Ringkasan belum diisi'} tone={draft.summary ? 'success' : 'danger'} />
        <View style={{ height: 8 }} />
        <Badge label={draft.bodyMd ? 'Isi artikel ✓' : 'Isi belum ditulis'} tone={draft.bodyMd ? 'success' : 'danger'} />
        <View style={{ height: 8 }} />
        <Badge label={coverAlt ? 'Alt foto sampul ✓' : 'Alt foto sampul belum diisi'} tone={coverAlt ? 'success' : 'warning'} />
      </Card>

      <Card>
        <Text style={styles.label}>Kategori</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((item) => (
            <Pressable key={item.slug} onPress={() => setCategory(item.slug)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: category === item.slug ? c.primary : c.sunken }}>
              <Text style={{ fontSize: 12, color: category === item.slug ? c.onPrimary : c.inkMuted, fontWeight: '600' }}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.label, { marginTop: 16 }]}>Komoditas</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {commodities.map((item) => (
            <Pressable key={item.id} onPress={() => setCommodityId(item.id)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: commodityId === item.id ? c.primary : c.sunken }}>
              <Text style={{ fontSize: 12, color: commodityId === item.id ? c.onPrimary : c.inkMuted, fontWeight: '600' }}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <Field label="Teks alternatif foto sampul" value={coverAlt} onChange={setCoverAlt} placeholder="Contoh: Daun cabai dengan bercak cokelat" />
        <Field label="Judul SEO" value={seoTitle} onChange={setSeoTitle} placeholder="Maksimal 60 karakter" />
        <Field label="Deskripsi SEO" value={seoDesc} onChange={setSeoDesc} placeholder="Maksimal 160 karakter" />
        <Text style={{ fontSize: 11, color: c.inkMuted, textAlign: 'right', marginTop: -8 }}>{seoDesc.length}/160</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <Switch value={fieldVerified} onValueChange={setFieldVerified} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>Terverifikasi lapangan</Text>
            <Text style={{ fontSize: 11, color: c.inkMuted }}>Centang hanya bila benar-benar diperiksa di lahan.</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Jadwal</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([['now', 'Sekarang'], ['later', 'Terjadwal']] as const).map(([value, label]) => (
            <Pressable key={value} onPress={() => setSchedule(value)} style={{ flex: 1, minHeight: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: schedule === value ? c.primary : c.sunken }}>
              <Text style={{ color: schedule === value ? c.onPrimary : c.inkMuted, fontWeight: '600', fontSize: 13 }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {build.status !== 'idle' && (
        <Card>
          <Badge label={build.status} tone={build.status === 'success' ? 'success' : build.status === 'failed' ? 'danger' : 'warning'} />
          <Text style={{ fontSize: 13, marginTop: 8 }}>{build.message}</Text>
        </Card>
      )}

      <Button title={publishing ? 'Memproses…' : schedule === 'now' ? 'Terbitkan' : 'Simpan terjadwal'} onPress={() => void publish()} disabled={publishing || (schedule === 'now' && !ready)} />
      {!ready && <Text style={{ fontSize: 12, color: c.warning, marginTop: 8, textAlign: 'center' }}>Lengkapi daftar periksa terlebih dahulu.</Text>}
      <View style={{ height: 12 }} />
      <Button title="Kembali ke editor" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = {
  label: { fontSize: 13, fontWeight: '700' as const, color: c.ink, marginBottom: 8 },
};

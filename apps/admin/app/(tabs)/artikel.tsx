import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Button, Card, EmptyState, FAB, Heading, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme } from '../../src/theme';
import type { ArticleDraft } from '@sabditani/core';

const c = theme.light.colors;
const filters = ['Semua', 'Draf', 'Terjadwal', 'Terbit'] as const;

function tone(status: ArticleDraft['status']) {
  if (status === 'published') return 'success' as const;
  if (status === 'scheduled') return 'info' as const;
  return 'warning' as const;
}

export default function ArticlesScreen() {
  const router = useRouter();
  const { drafts, createDraft, deleteDraft } = useAdmin();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Semua');
  const [query, setQuery] = useState('');

  const visible = drafts.filter((draft) => {
    const byStatus = filter === 'Semua' || (filter === 'Draf' && draft.status === 'draft') || (filter === 'Terjadwal' && draft.status === 'scheduled') || (filter === 'Terbit' && draft.status === 'published');
    const byQuery = draft.title.toLowerCase().includes(query.toLowerCase()) || draft.summary.toLowerCase().includes(query.toLowerCase());
    return byStatus && byQuery;
  });

  return (
    <Screen>
      <Heading title="Artikel" subtitle={`${drafts.length} artikel di perangkat ini`} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Cari artikel…"
        placeholderTextColor={c.inkMuted}
        style={{ minHeight: 46, backgroundColor: c.sunken, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12, color: c.ink }}
      />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {filters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: filter === item ? c.primary : c.sunken }}
          >
            <Text style={{ color: filter === item ? c.onPrimary : c.inkMuted, fontSize: 12, fontWeight: '600' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {visible.length === 0 ? (
        <EmptyState title="Belum ada artikel" description="Buat draf pertama dari lahan. Draf disimpan di perangkat sebelum disinkronkan." action={<View style={{ marginTop: 16 }}><Button title="Buat catatan baru" onPress={() => router.push(`/editor/${createDraft()}`)} /></View>} />
      ) : visible.map((draft) => (
        <Card key={draft.id}>
          <Pressable onPress={() => router.push(`/editor/${draft.id}`)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <Badge label={draft.status} tone={tone(draft.status)} />
              <Badge label={draft.syncState === 'local' ? 'Lokal' : draft.syncState === 'synced' ? 'Tersinkron' : draft.syncState === 'syncing' ? 'Sinkron' : 'Konflik'} tone={draft.syncState === 'synced' ? 'success' : 'warning'} />
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', marginTop: 10 }}>{draft.title || 'Tanpa judul'}</Text>
            <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 6 }} numberOfLines={2}>{draft.summary || 'Belum ada ringkasan.'}</Text>
            <Text style={{ fontSize: 11, color: c.inkMuted, marginTop: 8 }}>
              {new Date(draft.updatedAt).toLocaleString('id-ID')} · v{draft.version}
            </Text>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button title="Sunting" variant="secondary" small onPress={() => router.push(`/editor/${draft.id}`)} />
            {draft.status !== 'published' && <Button title="Terbitkan" small onPress={() => router.push(`/terbitkan/${draft.id}`)} />}
            <Button title="Hapus" variant="ghost" small onPress={() => deleteDraft(draft.id)} />
          </View>
        </Card>
      ))}
      <FAB onPress={() => router.push(`/editor/${createDraft()}`)} />
    </Screen>
  );
}

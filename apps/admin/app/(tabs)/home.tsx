import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Brand, Button, Card, FAB, Heading, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme } from '../../src/theme';
import { formatDate } from '@sabditani/core';

const c = theme.light.colors;

export default function HomeScreen() {
  const router = useRouter();
  const { drafts, build, online, outbox, syncNow, session, createDraft } = useAdmin();
  const draftCount = drafts.filter((d) => d.status === 'draft').length;
  const published = drafts.filter((d) => d.status === 'published').length;
  const last = drafts[0];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Brand />
        <Badge label={online ? 'Online' : 'Offline'} tone={online ? 'success' : 'warning'} />
      </View>
      <Heading title={`Selamat ${new Date().getHours() < 11 ? 'pagi' : new Date().getHours() < 15 ? 'siang' : 'sore'}, ${session?.email.split('@')[0] ?? 'Admin'}`} subtitle="Ruang kerja SABDITANI" />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          { label: 'Draf', value: draftCount, tone: c.accentText },
          { label: 'Terbit', value: published, tone: c.primary },
          { label: 'Antrean', value: outbox.length, tone: c.info },
        ].map((item) => (
          <Card key={item.label} style={{ flex: 1, marginBottom: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: item.tone }}>{item.value}</Text>
            <Text style={{ fontSize: 12, color: c.inkMuted, marginTop: 2 }}>{item.label}</Text>
          </Card>
        ))}
      </View>

      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Status situs</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: build.status === 'failed' ? c.danger : build.status === 'queued' ? c.warning : c.success }} />
          <Text style={{ fontSize: 15, fontWeight: '600' }}>
            {build.status === 'idle' ? 'Terakhir diperbarui 10.42' : build.status === 'queued' ? 'Sedang membangun situs' : build.status === 'success' ? 'Terbit' : 'Build gagal'}
          </Text>
        </View>
        {build.message && <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 8 }}>{build.message}</Text>}
        {build.at && <Text style={{ fontSize: 11, color: c.inkMuted, marginTop: 4 }}>{formatDate(build.at)}</Text>}
      </Card>

      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Draf terakhir</Text>
        {last ? (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{last.title || 'Tanpa judul'}</Text>
            <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 6 }} numberOfLines={2}>{last.summary || 'Belum ada ringkasan.'}</Text>
            <View style={{ marginTop: 12 }}>
              <Badge label={last.syncState === 'local' ? 'Tersimpan lokal' : last.syncState === 'syncing' ? 'Menyinkronkan' : last.syncState === 'conflict' ? 'Perlu tindakan' : 'Tersinkron'} tone={last.syncState === 'local' ? 'warning' : last.syncState === 'synced' ? 'success' : 'info'} />
            </View>
            <Button title="Lanjutkan menulis" variant="secondary" small onPress={() => router.push(`/editor/${last.id}`)} />
          </View>
        ) : (
          <Text style={{ color: c.inkMuted, marginTop: 12 }}>Belum ada draf. Ketuk tombol + untuk mencatat temuan lapangan.</Text>
        )}
      </Card>

      <Button title={outbox.length ? `Sinkronkan ${outbox.length} item sekarang` : 'Sinkronkan sekarang'} variant="secondary" onPress={() => void syncNow()} />
      <FAB onPress={() => { const id = createDraft(); router.push(`/editor/${id}`); }} />
    </Screen>
  );
}

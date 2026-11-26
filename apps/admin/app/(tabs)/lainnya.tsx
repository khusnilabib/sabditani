import { Pressable, Share, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Brand, Button, Card, Divider, Heading, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme } from '../../src/theme';
import { isBackendConfigured } from '../../src/lib/clients';

const c = theme.light.colors;

function Row({ label, note, onPress, right }: { label: string; note?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600' }}>{label}</Text>
          {note && <Text style={{ fontSize: 12, color: c.inkMuted, marginTop: 3 }}>{note}</Text>}
        </View>
        {right ?? <Text style={{ color: c.inkMuted }}>›</Text>}
      </View>
    </Pressable>
  );
}

export default function MoreScreen() {
  const router = useRouter();
  const { session, settings, updateSettings, exportBackup, signOut, drafts, media } = useAdmin();

  return (
    <Screen>
      <Brand />
      <Heading title="Pengaturan" subtitle={session?.demo ? 'Mode demo lokal' : `Masuk sebagai ${session?.email ?? ''}`} />
      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Data & konten</Text>
        <Row label="Komoditas & Kalender" note="Atur profil tanaman dan jendela waktu" onPress={() => router.push('/komoditas')} />
        <Divider />
        <Row label="Hama & Penyakit" note="Gejala dan pengendalian bertingkat" onPress={() => router.push('/hama')} />
        <Divider />
        <Row label={`Media (${media.length} foto)`} note="Foto lapangan pada perangkat ini" onPress={() => router.push('/(tabs)/media')} />
      </Card>
      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Keamanan & sinkronisasi</Text>
        <Row label="Kunci biometrik" note="Minta biometrik saat membuka aplikasi" right={<Switch value={settings.biometric} onValueChange={(value) => updateSettings({ biometric: value })} />} />
        <Divider />
        <Row label="Sinkron otomatis" note="Kirim antrean saat sinyal kembali" right={<Switch value={settings.autoSync} onValueChange={(value) => updateSettings({ autoSync: value })} />} />
        <Divider />
        <Row label="Status backend" note={isBackendConfigured ? 'Supabase & Worker terkonfigurasi' : 'Berjalan dalam mode demo lokal'} right={<Badge label={isBackendConfigured ? 'Aktif' : 'Demo'} tone={isBackendConfigured ? 'success' : 'warning'} />} />
      </Card>
      <Card>
        <Text style={{ fontSize: 12, fontWeight: '700', color: c.inkMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Cadangan</Text>
        <Row label="Ekspor cadangan" note={`${drafts.length} artikel dan ${media.length} foto dalam JSON`} onPress={() => void Share.share({ message: exportBackup(), title: 'Cadangan SABDITANI' })} />
        <Divider />
        <View style={{ marginTop: 16 }}><Button title="Keluar dan hapus data lokal" variant="secondary" onPress={() => void signOut()} /></View>
      </Card>
      <Text style={{ textAlign: 'center', color: c.inkMuted, fontSize: 11, marginTop: 12 }}>SABDITANI Admin v0.1 · sarana abdi tani</Text>
    </Screen>
  );
}

import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Brand, Button, Card, Field, Screen } from '../src/components/ui';
import { useAdmin } from '../src/state/AdminContext';
import { isBackendConfigured } from '../src/lib/clients';
import { theme } from '../src/theme';

const c = theme.light.colors;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAdmin();
  const [email, setEmail] = useState(isBackendConfigured ? '' : 'admin@sabditani.id');
  const [password, setPassword] = useState(isBackendConfigured ? '' : 'demo12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Masuk gagal.');
    } finally { setLoading(false); }
  };

  return (
    <Screen>
      <View style={{ paddingTop: 48 }}>
        <Brand />
        <Text style={{ fontSize: 32, fontWeight: '700', marginTop: 40, letterSpacing: -0.5 }}>Masuk ke ruang kerja</Text>
        <Text style={{ color: c.inkMuted, marginTop: 8, lineHeight: 22 }}>
          Tulis, potret, dan terbitkan konten langsung dari ponsel. Draf tersimpan di perangkat walau sinyal hilang.
        </Text>
        <Card style={{ marginTop: 28 }}>
          <Field label="Email" value={email} onChange={setEmail} placeholder="nama@sabditani.id" keyboardType="email-address" />
          <Field label="Kata sandi" value={password} onChange={setPassword} placeholder="Minimal 6 karakter" />
          {error ? <Text style={{ color: c.danger, fontSize: 13, marginBottom: 12 }}>{error}</Text> : null}
          <Button title={loading ? 'Memeriksa akun…' : 'Masuk'} onPress={() => void submit()} disabled={loading} />
        </Card>
        {!isBackendConfigured && (
          <View style={{ backgroundColor: '#F5EBCB', borderRadius: 12, padding: 14 }}>
            <Text style={{ fontWeight: '700', fontSize: 13, color: c.accentText }}>Mode demo lokal</Text>
            <Text style={{ fontSize: 13, color: c.inkMuted, lineHeight: 20, marginTop: 4 }}>
              Supabase belum dikonfigurasi. Gunakan email apa pun dan kata sandi minimal 6 karakter. Semua data tersimpan hanya di perangkat ini.
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 12, color: c.inkMuted, marginTop: 24, textAlign: 'center' }}>
          SABDITANI — sarana abdi tani · v0.1
        </Text>
      </View>
    </Screen>
  );
}

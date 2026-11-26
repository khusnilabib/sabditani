import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Brand, Screen } from '../src/components/ui';
import { useAdmin } from '../src/state/AdminContext';
import { Button } from '../src/components/ui';
import { theme } from '../src/theme';
import * as LocalAuthentication from 'expo-local-authentication';

export default function GateScreen() {
  const { ready, session, locked, unlock } = useAdmin();

  useEffect(() => {
    if (ready && session && locked) void unlock();
  }, [ready, session, locked, unlock]);

  if (!ready) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <Brand />
          <ActivityIndicator style={{ marginTop: 32 }} color={theme.light.colors.primary} />
          <Text style={{ color: theme.light.colors.inkMuted, marginTop: 12 }}>Menyiapkan ruang kerja…</Text>
        </View>
      </Screen>
    );
  }

  if (!session) return <Redirect href="/login" />;
  if (locked) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
          <Brand />
          <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 32, textAlign: 'center' }}>Aplikasi terkunci</Text>
          <Text style={{ color: theme.light.colors.inkMuted, textAlign: 'center', marginTop: 8 }}>
            Gunakan biometrik atau PIN perangkat untuk membuka ruang kerja Anda.
          </Text>
          <View style={{ marginTop: 24, width: '100%' }}>
            <Button title="Buka dengan biometrik" onPress={() => void unlock()} />
          </View>
        </View>
      </Screen>
    );
  }
  return <Redirect href="/(tabs)/home" />;
}

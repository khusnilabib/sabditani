import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AdminProvider } from '../src/state/AdminContext';

export default function RootLayout() {
  return (
    <AdminProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="editor/[id]" />
        <Stack.Screen name="terbitkan/[id]" />
        <Stack.Screen name="komoditas" />
        <Stack.Screen name="hama" />
      </Stack>
    </AdminProvider>
  );
}

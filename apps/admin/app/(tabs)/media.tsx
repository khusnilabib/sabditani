import { ActivityIndicator, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Badge, Button, Card, EmptyState, Heading, Screen } from '../../src/components/ui';
import { useAdmin } from '../../src/state/AdminContext';
import { theme } from '../../src/theme';

const c = theme.light.colors;

export default function MediaScreen() {
  const { media, addMedia, outbox, syncNow } = useAdmin();

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: false });
    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    try {
      const full = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], { compress: 0.8, format: ImageManipulator.SaveFormat.WEBP });
      const thumb = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 480 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.WEBP });
      addMedia({ uri: full.uri, thumbUri: thumb.uri, name: `foto-lapangan-${Date.now()}.webp` });
    } catch {
      addMedia({ uri, name: `foto-lapangan-${Date.now()}` });
    }
  };

  return (
    <Screen>
      <Heading title="Media" subtitle="Foto lapangan dikompres sebelum diunggah" action={<Button title="Pilih foto" small onPress={() => void pick()} />} />
      <Card>
        <Text style={{ fontSize: 14, fontWeight: '600' }}>Antrean unggah: {outbox.filter((item) => item.type === 'media').length}</Text>
        <Text style={{ fontSize: 12, color: c.inkMuted, marginTop: 6, lineHeight: 18 }}>
          Foto dikompres menjadi WebP maksimal 1.600 px dengan miniatur 480 px. Metadata EXIF tidak disimpan. Saat tanpa sinyal, foto tetap tersimpan di perangkat.
        </Text>
        <View style={{ marginTop: 12 }}><Button title="Proses antrean" variant="secondary" small onPress={() => void syncNow()} /></View>
      </Card>
      {media.length === 0 ? (
        <EmptyState title="Belum ada foto" description="Ambil foto dari galeri untuk melampirkannya ke artikel atau Catatan Lapangan." action={<View style={{ marginTop: 16 }}><Button title="Pilih foto" onPress={() => void pick()} /></View>} />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {media.map((item) => (
            <View key={item.id} style={{ width: '47%', backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 12, overflow: 'hidden' }}>
              <Image source={{ uri: item.thumbUri ?? item.uri }} style={{ width: '100%', height: 110 }} resizeMode="cover" />
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 11, color: c.inkMuted }} numberOfLines={1}>{item.name}</Text>
                <View style={{ marginTop: 6 }}><Badge label={item.uploaded ? 'Tersinkron' : 'Menunggu'} tone={item.uploaded ? 'success' : 'warning'} /></View>
              </View>
            </View>
          ))}
        </View>
      )}
      {outbox.length > 0 && <ActivityIndicator style={{ marginTop: 20 }} color={c.primary} />}
    </Screen>
  );
}

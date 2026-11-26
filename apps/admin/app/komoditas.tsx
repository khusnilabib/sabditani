import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Field, Heading, Screen } from '../src/components/ui';
import { useAdmin } from '../src/state/AdminContext';
import { theme } from '../src/theme';
import { calendarEntries, slugify } from '@sabditani/core';

const c = theme.light.colors;

export default function CommoditiesScreen() {
  const router = useRouter();
  const { crops, saveCrop } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');

  const save = () => {
    if (!name.trim()) return;
    const slug = slugify(name);
    saveCrop({ id: slug, slug, name: name.trim(), group: 'hortikultura', summary: summary.trim(), detail: summary.trim(), accent: '#2B6849', seedRate: '-' });
    setName(''); setSummary(''); setAdding(false);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22, color: c.primary }}>‹</Text></Pressable>
        <Heading title="Komoditas & Kalender" subtitle="Data lokal yang dipakai aplikasi admin" />
      </View>
      <Button title={adding ? 'Batal' : 'Tambah komoditas'} variant={adding ? 'secondary' : 'primary'} onPress={() => setAdding((value) => !value)} />
      {adding && (
        <Card style={{ marginTop: 12 }}>
          <Field label="Nama komoditas" value={name} onChange={setName} placeholder="Contoh: Kangkung" />
          <Field label="Ringkasan" value={summary} onChange={setSummary} placeholder="Catatan singkat tentang komoditas" />
          <Button title="Simpan komoditas" onPress={save} disabled={!name.trim()} />
        </Card>
      )}
      {crops.map((crop) => (
        <Card key={crop.id}>
          <Text style={{ fontSize: 17, fontWeight: '700' }}>{crop.name}</Text>
          <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 4 }}>{crop.summary}</Text>
          <Text style={{ fontSize: 11, color: c.inkMuted, marginTop: 8 }}>
            {calendarEntries.filter((entry) => entry.commodityId === crop.id).length} jendela kalender · {crop.group}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

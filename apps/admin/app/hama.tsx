import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Button, Card, Field, Heading, Screen } from '../src/components/ui';
import { useAdmin } from '../src/state/AdminContext';
import { theme } from '../src/theme';
import { slugify, type Pest } from '@sabditani/core';

const c = theme.light.colors;

export default function PestsScreen() {
  const router = useRouter();
  const { pestsList, savePest } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');

  const save = () => {
    if (!name.trim()) return;
    const slug = slugify(name);
    const pest: Pest = {
      id: slug, slug, name: name.trim(), kind: 'hama', summary: summary.trim(), cause: 'Belum diisi.',
      controlMd: '## Pengendalian bertingkat\n\n1. Budidaya: belum diisi.\n2. Hayati: belum diisi.\n3. Kimia: belum diisi.',
      commodityIds: [], symptomIds: [],
    };
    savePest(pest);
    setName(''); setSummary(''); setAdding(false);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 22, color: c.primary }}>‹</Text></Pressable>
        <Heading title="Hama & Penyakit" subtitle="Data lokal gejala dan pengendalian" />
      </View>
      <Button title={adding ? 'Batal' : 'Tambah data'} variant={adding ? 'secondary' : 'primary'} onPress={() => setAdding((value) => !value)} />
      {adding && (
        <Card style={{ marginTop: 12 }}>
          <Field label="Nama hama atau penyakit" value={name} onChange={setName} placeholder="Contoh: Ulat grayak" />
          <Field label="Ringkasan" value={summary} onChange={setSummary} placeholder="Gejala singkat" />
          <Button title="Simpan data" onPress={save} disabled={!name.trim()} />
        </Card>
      )}
      {pestsList.map((pest) => (
        <Card key={pest.id}>
          <Badge label={pest.kind} />
          <Text style={{ fontSize: 17, fontWeight: '700', marginTop: 8 }}>{pest.name}</Text>
          <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 4 }}>{pest.summary}</Text>
          <Text style={{ fontSize: 11, color: c.inkMuted, marginTop: 8 }}>{pest.symptomIds.length} gejala tercatat</Text>
        </Card>
      ))}
    </Screen>
  );
}

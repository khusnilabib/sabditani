import { Linking, Text, View } from 'react-native';
import { Badge, Button, Card, Heading, Screen } from '../../src/components/ui';
import { site } from '@sabditani/core';
import { theme } from '../../src/theme';

const c = theme.light.colors;

const messages = [
  { id: 1, name: 'Pak Joko', contact: '0812-3456-7890', body: 'Pak, untuk cabai di lahan 1.000 m² berapa kg NPK yang dipakai?', time: '09.24', unread: true },
  { id: 2, name: 'Bu Sari', contact: '0856-1122-3344', body: 'Panduan hawar daun boleh saya bagikan ke grup penyuluh?', time: 'Kemarin', unread: true },
  { id: 3, name: 'Rani', contact: '0813-9001-2222', body: 'Terima kasih, kalender tanamnya sangat membantu.', time: '2 hari lalu', unread: false },
];

export default function MessagesScreen() {
  return (
    <Screen>
      <Heading title="Pesan" subtitle="Balas pertanyaan pembaca lewat WhatsApp" />
      {messages.map((message) => (
        <Card key={message.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{message.name}</Text>
            <Text style={{ fontSize: 11, color: c.inkMuted }}>{message.time}</Text>
          </View>
          <Text style={{ fontSize: 13, color: c.inkMuted, marginTop: 2 }}>{message.contact}</Text>
          <Text style={{ fontSize: 14, marginTop: 10, lineHeight: 21 }}>{message.body}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            {message.unread && <Badge label="Baru" tone="info" />}
            <Button title="Balas via WhatsApp" small onPress={() => Linking.openURL(`${site.whatsapp}?text=${encodeURIComponent(`Halo ${message.name}, terima kasih atas pesannya. `)}`)} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

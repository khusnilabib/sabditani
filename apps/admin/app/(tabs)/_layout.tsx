import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { theme } from '../../src/theme';

const c = theme.light.colors;

const tabs = [
  { name: 'home', title: 'Beranda', icon: '⌂' },
  { name: 'artikel', title: 'Artikel', icon: '▤' },
  { name: 'media', title: 'Media', icon: '▣' },
  { name: 'pesan', title: 'Pesan', icon: '✉' },
  { name: 'lainnya', title: 'Lainnya', icon: '⚙' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.inkMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line, height: 68, paddingBottom: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color, fontSize: 20, lineHeight: 24 }}>{tab.icon}</Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

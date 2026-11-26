import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, radius, spacing } from '../theme';

const c = theme.light.colors;

export function Screen({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={[styles.scroll, padded && styles.padded]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <Image source={require('../../assets/brand/logo-icon-transparent.png')} style={{ width: small ? 30 : 38, height: small ? 30 : 38 }} resizeMode="contain" />
      <View>
        <Text style={[styles.brandName, { fontSize: small ? 17 : 20 }]}>
          <Text style={{ color: c.primary }}>SABDI</Text><Text style={{ color: '#964903' }}>TANI</Text>
        </Text>
        {!small && <Text style={styles.brandTag}>sarana abdi tani</Text>}
      </View>
    </View>
  );
}

export function Heading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <View style={styles.heading}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', disabled, small }: {
  title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; small?: boolean;
}) {
  const background = variant === 'primary' ? c.primary : variant === 'secondary' ? c.surface : 'transparent';
  const color = variant === 'primary' ? c.onPrimary : c.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, borderColor: variant === 'secondary' ? c.line : 'transparent' },
        small && styles.buttonSmall,
        pressed && { opacity: 0.75 },
        disabled && { opacity: 0.45 },
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.buttonText, { color }, small && { fontSize: 13 }]}>{title}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  const background = tone === 'success' ? c.primaryContainer : tone === 'warning' ? '#F5EBCB' : tone === 'danger' ? '#FBE4E1' : tone === 'info' ? '#E3ECF7' : c.sunken;
  const color = tone === 'success' ? c.primary : tone === 'warning' ? c.accentText : tone === 'danger' ? c.danger : tone === 'info' ? c.info : c.inkMuted;
  return <View style={[styles.badge, { backgroundColor: background }]}><Text style={[styles.badgeText, { color }]}>{label}</Text></View>;
}

export function Field({ label, value, onChange, placeholder, multiline, keyboardType = 'default' }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.inkMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  );
}

export function Divider() { return <View style={styles.divider} />; }

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{description}</Text>
      {action}
    </View>
  );
}

export function FAB({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]} accessibilityLabel="Buat catatan baru">
      <Text style={{ color: c.onPrimary, fontSize: 28, lineHeight: 30 }}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.canvas },
  scroll: { flexGrow: 1 },
  padded: { padding: spacing[4], paddingBottom: 100 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontFamily: 'Fraunces', fontWeight: '600', letterSpacing: -0.6 },
  brandTag: { fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase', color: c.inkMuted, marginTop: 2 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: c.ink, letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: c.inkMuted, marginTop: 4 },
  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderWidth: 1 },
  buttonSmall: { minHeight: 38, paddingHorizontal: 14 },
  buttonText: { fontSize: 15, fontWeight: '600' },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, color: c.ink },
  input: { minHeight: 48, backgroundColor: c.sunken, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, paddingHorizontal: 14, fontSize: 15, color: c.ink },
  textarea: { minHeight: 120, paddingTop: 12, textAlignVertical: 'top' },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 16 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: c.line, borderRadius: radius.lg, padding: 32, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, color: c.inkMuted, textAlign: 'center', lineHeight: 20 },
  fab: { position: 'absolute', right: 20, bottom: 92, width: 56, height: 56, borderRadius: 28, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#14110F', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
});

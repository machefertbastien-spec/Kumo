import React from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Context
import { useReminders } from '../../contexts';

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

// Helper function
function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

// Card Component
const Card = ({ children, style }: any) => (
  <View
    style={[
      {
        backgroundColor: THEME.card,
        borderRadius: 20,
        padding: 16,
        shadowColor: THEME.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
      style,
    ]}
  >
    {children}
  </View>
);

// Divider Component
const Divider = () => <View style={{ height: 1, backgroundColor: THEME.line, marginVertical: 12 }} />;

// ToggleRow Component
const ToggleRow = ({ title, subtitle, value, onValueChange }: any) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontWeight: '800', color: THEME.text }}>{title}</Text>
        {!!subtitle && <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>{subtitle}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

// Chip Component
const Chip = ({ label, active, onPress }: any) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: active ? THEME.primary : THEME.line,
      backgroundColor: active ? THEME.primary : THEME.card,
      marginRight: 8,
      marginBottom: 8,
      opacity: pressed ? 0.8 : 1,
    })}
  >
    <Text style={{ fontWeight: '800', color: active ? THEME.card : THEME.text }}>{label}</Text>
  </Pressable>
);

export function NotificationsScreen() {
  // Use context hooks
  const { reminderSettings, setReminderSettings } = useReminders();

  const setGap = (m: number) => setReminderSettings((p: any) => ({ ...p, feedingGapMinutes: m }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text }}>Notifications</Text>

        <Card style={{ marginTop: 12 }}>
          <ToggleRow
            title="Push"
            subtitle="Nécessite l'autorisation sur ton téléphone"
            value={reminderSettings.pushEnabled}
            onValueChange={(v: boolean) => setReminderSettings((p: any) => ({ ...p, pushEnabled: v }))}
          />
          <Divider />
          <ToggleRow
            title="Quiet hours"
            subtitle={`${reminderSettings.quietStartHour}:00 → ${reminderSettings.quietEndHour}:00`}
            value={reminderSettings.quietHoursEnabled}
            onValueChange={(v: boolean) => setReminderSettings((p: any) => ({ ...p, quietHoursEnabled: v }))}
          />
        </Card>

        <Card style={{ marginTop: 12, padding: 14 }}>
          <Text style={{ fontWeight: '900', color: THEME.text }}>Auto : pas de biberon depuis X</Text>
          <Text style={{ marginTop: 6, color: THEME.muted }}>On planifie un rappel à partir du dernier "Repas".</Text>

          <View style={{ marginTop: 10 }}>
            <ToggleRow
              title="Activer"
              subtitle=""
              value={reminderSettings.feedingGapEnabled}
              onValueChange={(v: boolean) => setReminderSettings((p: any) => ({ ...p, feedingGapEnabled: v }))}
            />
          </View>

          <Text style={{ marginTop: 10, fontWeight: '800', color: THEME.muted }}>
            Seuil actuel : {round1(reminderSettings.feedingGapMinutes / 60)}h
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            <Chip label="5 min (test)" active={reminderSettings.feedingGapMinutes === 5} onPress={() => setGap(5)} />
            <Chip label="1h" active={reminderSettings.feedingGapMinutes === 60} onPress={() => setGap(60)} />
            <Chip label="2h" active={reminderSettings.feedingGapMinutes === 120} onPress={() => setGap(120)} />
            <Chip label="3h" active={reminderSettings.feedingGapMinutes === 180} onPress={() => setGap(180)} />
            <Chip label="4h" active={reminderSettings.feedingGapMinutes === 240} onPress={() => setGap(240)} />
          </View>

          <Text style={{ marginTop: 8, fontSize: 12, color: THEME.muted }}>
            Astuce : en Expo Go, les notifications locales marchent surtout sur vrai téléphone (pas le preview web).
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

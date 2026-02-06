import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addDays,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { SFIcon } from '../components/SFIcon';

// Context
import { useBaby, useEvents } from '../contexts';

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

// Icon Helper
const Icon = ({ name, size = 24, color = THEME.text, ...props }: any) => {
  if (name === 'chevron-back') {
    return <SFIcon name="chevron.left" size={size} color={color} />;
  }
  if (name === 'chevron-forward') {
    return <SFIcon name="chevron.right" size={size} color={color} />;
  }
  
  return <SFIcon name="chevron.right" size={size} color={color} />;
};

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

// EventRow Component (simplified for now)
const EventRow = ({ e, onPress }: any) => {
  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      sleep: '😴',
      feeding: '🍼',
      diaper: '💩',
    };
    return icons[type] || '📝';
  };

  const getEventLabel = (e: any) => {
    if (e.type === 'sleep') {
      if (e.endTs) {
        const duration = Math.round((e.endTs - e.ts) / 60000);
        return `Sommeil (${duration} min)`;
      }
      return 'Sommeil en cours…';
    }
    if (e.type === 'feeding') {
      return `Repas${e.amountMl ? ` (${e.amountMl} ml)` : ''}`;
    }
    if (e.type === 'diaper') {
      const types = { pee: 'Pipi', poo: 'Caca', mixed: 'Mixte' };
      return types[e.diaperType as keyof typeof types] || 'Couche';
    }
    return e.type;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 24, marginRight: 12 }}>{getEventIcon(e.type)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '800', color: THEME.text }}>{getEventLabel(e)}</Text>
        <Text style={{ fontSize: 12, color: THEME.muted, marginTop: 2 }}>
          {format(new Date(e.ts), 'HH:mm')}
        </Text>
      </View>
    </Pressable>
  );
};

export function HistoryScreen() {
  // Use context hooks
  const { baby } = useBaby();
  const { events, onOpenEditEvent } = useEvents();

  const [selected, setSelected] = useState(new Date());

  const weekStart = useMemo(() => startOfWeek(selected, { weekStartsOn: 1 }), [selected]);
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);

  const babyEvents = useMemo(() => {
    if (!baby) return [];
    return events
      .filter((e) => !e.deletedAt && e.babyId === baby.id)
      .slice()
      .sort((a, b) => b.ts - a.ts);
  }, [events, baby]);

  const dayEvents = useMemo(() => {
    return babyEvents.filter((e) => isSameDay(new Date(e.ts), selected));
  }, [babyEvents, selected]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text }}>Historique</Text>

        <Card style={{ marginTop: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable onPress={() => setSelected(addDays(selected, -7))} style={{ padding: 8 }}>
              <Icon name="chevron-back" size={18} color={THEME.muted} />
            </Pressable>

            <Text style={{ fontWeight: '800', color: THEME.text }}>
              {format(selected, 'MMMM yyyy', { locale: fr })}
            </Text>

            <Pressable onPress={() => setSelected(addDays(selected, 7))} style={{ padding: 8 }}>
              <Icon name="chevron-forward" size={18} color={THEME.muted} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            {days.map((d) => {
              const isSel = isSameDay(d, selected);
              const dow = format(d, 'EEE', { locale: fr });
              const dayNum = format(d, 'd', { locale: fr });

              return (
                <Pressable
                  key={d.toISOString()}
                  onPress={() => setSelected(d)}
                  style={({ pressed }) => ({
                    width: 42,
                    alignItems: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: THEME.muted }}>{dow}</Text>
                  <View
                    style={{
                      marginTop: 6,
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: isSel ? THEME.primary : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: isSel ? 0 : 1,
                      borderColor: THEME.line,
                    }}
                  >
                    <Text style={{ fontWeight: '900', color: isSel ? THEME.card : THEME.text }}>{dayNum}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Text style={{ marginTop: 14, fontWeight: '800', color: THEME.muted }}>
          {format(selected, 'EEEE d MMMM', { locale: fr })}
        </Text>

        <Card style={{ marginTop: 10 }}>
          {dayEvents.length === 0 ? (
            <View style={{ paddingVertical: 26, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', color: THEME.muted }}>Aucun événement ce jour</Text>
            </View>
          ) : (
            <>
              {dayEvents.map((e, idx) => (
                <View key={e.id}>
                  <EventRow e={e} onPress={() => onOpenEditEvent(e)} />
                  {idx < dayEvents.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </>
          )}
        </Card>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

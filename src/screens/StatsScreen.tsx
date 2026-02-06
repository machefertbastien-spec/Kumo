import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns';
import { fr } from 'date-fns/locale';

// Context
import { useBaby, useEvents } from '../contexts';

// Growth
import { loadMeasurements, AddMeasurementSheet } from '../features/growth';

// Components
import { PercentileChart } from '../components/ui/PercentileChart';
import { ScreenHeader } from '../components/ui';

// Constants
const DAY_MS = 86400000;

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

// Helper functions
function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

function msToHours(ms: number): number {
  return ms / 3600000;
}

function calcSleepTotalBetween(events: any[], rangeStartMs: number, rangeEndMs: number): number {
  let total = 0;
  for (const e of events) {
    if (e.type !== 'sleep' || e.deletedAt) continue;
    const s = e.startTs ?? e.ts;
    const end = e.endTs ?? Date.now();
    if (end <= rangeStartMs) continue;
    if (s >= rangeEndMs) continue;
    const from = Math.max(s, rangeStartMs);
    const to = Math.min(end, rangeEndMs);
    total += Math.max(0, to - from);
  }
  return total;
}

// Card Component
const Card = ({ children, style }: any) => (
  <View
    style={[
      {
        backgroundColor: THEME.card,
        borderRadius: 20,
        padding: 16,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export function StatsScreen({ nowMs }: { nowMs: number }) {
  const { baby } = useBaby();
  const { events } = useEvents();

  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'length'>('weight');
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);

  const loadData = React.useCallback(() => {
    if (baby) {
      loadMeasurements(baby.id).then((data) => {
        console.log('[StatsScreen] Loaded measurements:', data.length);
        setMeasurements(data);
      });
    }
  }, [baby]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), []);
  const todayEnd = todayStart + DAY_MS;

  const babyEvents = useMemo(() => {
    if (!baby) return [];
    return events.filter((e) => !e.deletedAt && e.babyId === baby.id);
  }, [events, baby]);

  const todayMetrics = useMemo(() => {
    const sleepMs = calcSleepTotalBetween(babyEvents, todayStart, todayEnd);
    const sleepH = round1(msToHours(sleepMs));
    const diapers = babyEvents.filter((e) => e.type === 'diaper' && e.ts >= todayStart && e.ts < todayEnd).length;
    const feedingMl = babyEvents
      .filter((e) => e.type === 'feeding' && e.ts >= todayStart && e.ts < todayEnd)
      .reduce((sum, e) => sum + (e.amountMl || 0), 0);
    
    return { sleepH, diapers, feedingMl };
  }, [babyEvents, todayStart, todayEnd]);

  const formatSleepDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m < 10 ? '0' : ''}${m}`;
  };

  const chartMeasurements = useMemo(() => {
    return measurements
      .filter((m) => m.type === selectedMetric)
      .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime())
      .slice(-6);
  }, [measurements, selectedMetric]);

  const metricConfig = {
    weight: { label: 'Poids', color: '#D27C57' },
    length: { label: 'Taille', color: '#9FB59B' },
  };

  const SimpleLineChart = ({ data, color }: { data: any[]; color: string }) => {
    if (data.length === 0) return null;

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = Dimensions.get('window').width - 64;
    const height = 180;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
      return { x, y };
    });

    return (
      <View style={{ width, height, marginVertical: 8 }}>
        <View style={{ position: 'absolute', left: 0, top: padding, bottom: padding, justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, color: THEME.muted }}>{max.toFixed(1)}</Text>
          <Text style={{ fontSize: 10, color: THEME.muted }}>{((max + min) / 2).toFixed(1)}</Text>
          <Text style={{ fontSize: 10, color: THEME.muted }}>{min.toFixed(1)}</Text>
        </View>

        <View style={{ position: 'absolute', left: padding, right: padding, top: padding, bottom: padding }}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ height: 1, backgroundColor: THEME.line }} />
            ))}
          </View>

          {points.map((point, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: prev.x - padding,
                  top: prev.y - padding,
                  width: length,
                  height: 2,
                  backgroundColor: color,
                  transform: [{ rotate: `${angle}deg` }],
                }}
              />
            );
          })}

          {points.map((point, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: point.x - padding - 4,
                top: point.y - padding - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: color,
                borderWidth: 2,
                borderColor: THEME.card,
              }}
            />
          ))}
        </View>

        <View style={{ position: 'absolute', bottom: 0, left: padding, right: padding, flexDirection: 'row', justifyContent: 'space-between' }}>
          {data.map((d, i) => (
            <Text key={i} style={{ fontSize: 10, color: THEME.muted, width: 40, textAlign: 'center' }}>
              {format(new Date(d.measuredAt), 'MMM', { locale: fr })}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      {/* Header with settings button */}
      <ScreenHeader showLogo />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 16 }}>Suivi</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: THEME.card, borderRadius: 18, padding: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>😴</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text }}>
              {formatSleepDuration(todayMetrics.sleepH)}
            </Text>
            <Text style={{ fontSize: 12, color: THEME.muted, marginTop: 2 }}>de sommeil</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: THEME.card, borderRadius: 18, padding: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🧷</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text }}>{todayMetrics.diapers}</Text>
            <Text style={{ fontSize: 12, color: THEME.muted, marginTop: 2 }}>changes</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: THEME.card, borderRadius: 18, padding: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🍼</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text }}>{todayMetrics.feedingMl} ml</Text>
            <Text style={{ fontSize: 12, color: THEME.muted, marginTop: 2 }}>de lait</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <Pressable
            onPress={() => setSelectedMetric('length')}
            style={{ 
              flex: 1, 
              paddingVertical: 10, 
              borderRadius: 20, 
              backgroundColor: selectedMetric === 'length' ? THEME.primary : 'transparent', 
              borderWidth: selectedMetric === 'length' ? 0 : 1,
              borderColor: THEME.line,
              alignItems: 'center' 
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: selectedMetric === 'length' ? THEME.card : THEME.muted }}>
              Taille
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedMetric('weight')}
            style={{ 
              flex: 1, 
              paddingVertical: 10, 
              borderRadius: 20, 
              backgroundColor: selectedMetric === 'weight' ? THEME.primary : 'transparent', 
              borderWidth: selectedMetric === 'weight' ? 0 : 1,
              borderColor: THEME.line,
              alignItems: 'center' 
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: selectedMetric === 'weight' ? THEME.card : THEME.muted }}>
              Poids
            </Text>
          </Pressable>
        </View>

        {/* Courbe percentile OMS */}
        {baby && baby.sex && baby.birthDateISO && (
          <View style={{ marginBottom: 16 }}>
            <PercentileChart
              measurements={chartMeasurements}
              sex={baby.sex}
              metric={selectedMetric}
              birthDateISO={baby.birthDateISO}
            />
          </View>
        )}

        {/* Fallback si pas de données bébé */}
        {(!baby || !baby.sex || !baby.birthDateISO) && (
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: THEME.muted, fontWeight: '600' }}>Profil incomplet</Text>
              <Text style={{ fontSize: 12, color: THEME.muted, marginTop: 4 }}>Complétez le profil de bébé pour voir les courbes</Text>
            </View>
          </Card>
        )}

        <Pressable
          onPress={() => setShowAddMeasurement(true)}
          style={({ pressed }) => ({ backgroundColor: THEME.primary, borderRadius: 20, paddingVertical: 14, alignItems: 'center', marginBottom: 20, opacity: pressed ? 0.9 : 1 })}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.card }}>Entrer une nouvelle donnée</Text>
        </Pressable>

        {baby && (
          <AddMeasurementSheet
            childId={baby.id}
            visible={showAddMeasurement}
            onClose={() => setShowAddMeasurement(false)}
            onSuccess={loadData}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * SleepPlannerScreen - Smart sleep prediction based on baby's patterns
 * Analyzes last 7 days of sleep data to predict optimal nap/bedtime
 */

import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks
import { useSleepPlanner } from '../hooks/useSleepPlanner';

// Context
import { useBaby, useEvents } from '../contexts';

// Components
import { SleepPlannerCard } from '../components/SleepPlannerCard';
import { SleepPlannerSettings } from '../components/SleepPlannerSettings';

// Constants
const THEME = {
  bg: '#FBF8F2',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#7A7A7A',
};

// Card Component (local for now)
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
        borderWidth: 1,
        borderColor: '#ECECEC',
      },
      style,
    ]}
  >
    {children}
  </View>
);

interface SleepPlannerScreenProps {
  nowMs: number;
}

export function SleepPlannerScreen({ nowMs }: SleepPlannerScreenProps) {
  // Use context hooks
  const { baby } = useBaby();
  const { events } = useEvents();

  // SleepPlanner hook
  const { 
    result: sleepPlannerResult, 
    settings: sleepPlannerSettings, 
    updateSettings: updateSleepPlannerSettings, 
    quickAdjust 
  } = useSleepPlanner(baby, events, nowMs);

  const [sleepPlannerSettingsVisible, setSleepPlannerSettingsVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 16 }}>
          SleepPlanner
        </Text>

        <SleepPlannerCard
          result={sleepPlannerResult}
          onSettingsPress={() => setSleepPlannerSettingsVisible(true)}
          onQuickAdjust={quickAdjust}
        />

        {/* Info Section */}
        <Card style={{ padding: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text, marginBottom: 8 }}>
            💡 Comment ça marche ?
          </Text>
          <Text style={{ fontSize: 14, color: THEME.muted, lineHeight: 20 }}>
            SleepPlanner analyse les habitudes de sommeil de votre bébé sur les 7 derniers jours pour prédire le meilleur moment pour la prochaine sieste ou le coucher.
          </Text>
          <Text style={{ fontSize: 14, color: THEME.muted, lineHeight: 20, marginTop: 8 }}>
            Plus vous enregistrez de dodos, plus les prédictions seront précises !
          </Text>
        </Card>
      </ScrollView>

      {/* SleepPlanner Settings Modal */}
      {sleepPlannerSettingsVisible && sleepPlannerSettings && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: THEME.card }}>
          <SleepPlannerSettings
            settings={sleepPlannerSettings}
            onSave={updateSleepPlannerSettings}
            onClose={() => setSleepPlannerSettingsVisible(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

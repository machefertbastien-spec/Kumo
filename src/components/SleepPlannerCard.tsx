import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SleepPlannerResult } from '../constants/sleepplanner';
import { THEME } from '../constants/theme';
import { Card } from './Card';

interface SleepPlannerCardProps {
  result: SleepPlannerResult | null;
  onSettingsPress: () => void;
  onQuickAdjust: (minutes: number) => void;
}

export function SleepPlannerCard({ result, onSettingsPress, onQuickAdjust }: SleepPlannerCardProps) {
  // Empty state
  if (!result || !result.window) {
    return (
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>🌙 SleepPlanner</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Pas encore de prédiction</Text>
          <Text style={styles.emptyBody}>
            Enregistrez quelques dodos pour voir les créneaux idéaux
          </Text>
        </View>
      </Card>
    );
  }
  
  const { window, countdown } = result;
  
  // Format times
  const earliestTime = format(new Date(window.earliestMs), 'HH:mm', { locale: fr });
  const targetTime = format(new Date(window.targetMs), 'HH:mm', { locale: fr });
  const latestTime = format(new Date(window.latestMs), 'HH:mm', { locale: fr });
  
  // Status colors
  const statusColors = {
    too_early: '#9E9E9E',
    ideal: THEME.green,
    too_late: '#FF9800',
    unknown: '#9E9E9E',
  };
  
  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          🌙 Prochain {window.slotType === 'bedtime' ? 'Coucher' : 'Dodo'}
        </Text>
        <Pressable onPress={onSettingsPress} hitSlop={10}>
          <Text style={styles.settingsButton}>⚙️</Text>
        </Pressable>
      </View>
      
      {/* Timeline */}
      <View style={styles.timeline}>
        <View style={styles.timelineBar}>
          <View style={[styles.timelineZone, { backgroundColor: '#F0F0F0' }]} />
          <View style={[styles.timelineZone, { backgroundColor: '#E8F5E9' }]} />
          <View style={[styles.timelineZone, { backgroundColor: '#FFF3E0' }]} />
        </View>
        
        <View style={styles.timeLabels}>
          <Text style={styles.timeLabel}>{earliestTime}</Text>
          <Text style={[styles.timeLabel, styles.timeLabelTarget]}>{targetTime}</Text>
          <Text style={styles.timeLabel}>{latestTime}</Text>
        </View>
      </View>
      
      {/* Countdown */}
      <View style={[styles.countdown, { backgroundColor: statusColors[countdown.status] + '20' }]}>
        <Text style={[styles.countdownText, { color: statusColors[countdown.status] }]}>
          {countdown.message}
        </Text>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onQuickAdjust(-15)}
          style={({ pressed }) => [styles.adjustButton, pressed && styles.adjustButtonPressed]}
        >
          <Text style={styles.adjustButtonText}>-15 min</Text>
        </Pressable>
        
        <Pressable
          onPress={() => onQuickAdjust(+15)}
          style={({ pressed }) => [styles.adjustButton, pressed && styles.adjustButtonPressed]}
        >
          <Text style={styles.adjustButtonText}>+15 min</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.text,
  },
  settingsButton: {
    fontSize: 20,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: THEME.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Timeline
  timeline: {
    marginBottom: 16,
  },
  timelineBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  timelineZone: {
    flex: 1,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    color: THEME.muted,
    fontWeight: '700',
  },
  timeLabelTarget: {
    color: THEME.green,
    fontWeight: '900',
  },
  
  // Countdown
  countdown: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '900',
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  adjustButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.line,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  adjustButtonPressed: {
    backgroundColor: '#F6F6F6',
  },
  adjustButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.text,
  },
});

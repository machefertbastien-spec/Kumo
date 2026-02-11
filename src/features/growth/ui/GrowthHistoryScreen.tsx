/**
 * Growth History Screen
 * Lists all measurements with filters and edit/delete actions
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Metric, Sex, MeasurementWithStats } from '../types';
import { METRIC_LABELS, METRIC_UNITS } from '../types';
import { useGrowthData } from '../hooks/useGrowthData';
import { deleteMeasurement } from '../storage/measurementsRepo';

const THEME = {
  primary: '#D48A63',
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  border: '#EFE7E1',
  green: '#D48A63',
  red: '#E85D75',
};

interface GrowthHistoryScreenProps {
  childId: string;
  childDob: string;
  childSex: Sex;
}

export function GrowthHistoryScreen({ childId, childDob, childSex }: GrowthHistoryScreenProps) {
  const [filterMetric, setFilterMetric] = useState<Metric | 'all'>('all');

  const weightData = useGrowthData({ childId, childDob, childSex, metric: 'weight' });
  const lengthData = useGrowthData({ childId, childDob, childSex, metric: 'length' });

  // Combine all measurements
  const allMeasurements = [
    ...weightData.measurements,
    ...lengthData.measurements,
  ].sort((a, b) =>
    new Date(b.measurement.measuredAt).getTime() - new Date(a.measurement.measuredAt).getTime()
  );

  // Filter measurements
  const filteredMeasurements = filterMetric === 'all'
    ? allMeasurements
    : allMeasurements.filter(m => m.measurement.type === filterMetric);

  const loading = weightData.loading || lengthData.loading;

  // Handle delete
  const handleDelete = useCallback((measurementId: string, type: Metric) => {
    Alert.alert(
      'Supprimer cette mesure ?',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeasurement(childId, measurementId);
              // Refetch the specific metric
              if (type === 'weight') weightData.refetch();
              if (type === 'length') lengthData.refetch();
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de supprimer la mesure');
            }
          },
        },
      ]
    );
  }, [childId, weightData, lengthData]);

  // Format percentile
  const formatPercentile = (p: number): string => {
    if (!isFinite(p)) return '—';
    if (p < 3) return '< 3e';
    if (p > 97) return '> 97e';
    return `${Math.round(p)}e`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.title}>Historique</Text>

        {/* Filters */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterButton, filterMetric === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterMetric('all')}
          >
            <Text style={[styles.filterText, filterMetric === 'all' && styles.filterTextActive]}>
              Tout
            </Text>
          </Pressable>
          {(['weight', 'length'] as Metric[]).map(metric => (
            <Pressable
              key={metric}
              style={[styles.filterButton, filterMetric === metric && styles.filterButtonActive]}
              onPress={() => setFilterMetric(metric)}
            >
              <Text style={[styles.filterText, filterMetric === metric && styles.filterTextActive]}>
                {METRIC_LABELS[metric]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={THEME.primary} />
          </View>
        )}

        {/* Empty State */}
        {!loading && filteredMeasurements.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Aucune mesure enregistrée</Text>
          </View>
        )}

        {/* Measurements List */}
        {!loading && filteredMeasurements.map((item, index) => (
          <MeasurementCard
            key={item.measurement.id}
            item={item}
            showDelta={index < filteredMeasurements.length - 1}
            onDelete={() => handleDelete(item.measurement.id, item.measurement.type)}
            formatPercentile={formatPercentile}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Measurement Card Component
interface MeasurementCardProps {
  item: MeasurementWithStats;
  showDelta: boolean;
  onDelete: () => void;
  formatPercentile: (p: number) => string;
}

function MeasurementCard({ item, showDelta, onDelete, formatPercentile }: MeasurementCardProps) {
  const { measurement, ageDays, percentile, deltaValue, deltaDays } = item;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardMetric}>{METRIC_LABELS[measurement.type]}</Text>
          <Text style={styles.cardDate}>
            {format(new Date(measurement.measuredAt), 'dd MMMM yyyy', { locale: fr })}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={10}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardValue}>
          <Text style={styles.cardNumber}>{measurement.value}</Text>
          <Text style={styles.cardUnit}>{METRIC_UNITS[measurement.type]}</Text>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Âge:</Text>
            <Text style={styles.statValue}>{ageDays} jours</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Percentile:</Text>
            <Text style={styles.statValue}>{formatPercentile(percentile)}</Text>
          </View>
          {showDelta && deltaValue !== undefined && deltaDays !== undefined && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Évolution:</Text>
              <Text style={[styles.statValue, deltaValue > 0 ? styles.statPositive : styles.statNegative]}>
                {deltaValue > 0 ? '+' : ''}{deltaValue} {METRIC_UNITS[measurement.type]} / {deltaDays}j
              </Text>
            </View>
          )}
        </View>
      </View>

      {measurement.note && (
        <View style={styles.cardNote}>
          <Text style={styles.cardNoteText}>💬 {measurement.note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: THEME.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: THEME.border,
  },
  filterButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.muted,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardMetric: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  cardDate: {
    fontSize: 13,
    color: THEME.muted,
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    opacity: 0.6,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.primary,
  },
  cardUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.muted,
    marginLeft: 4,
  },
  cardStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.muted,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.text,
  },
  statPositive: {
    color: THEME.green,
  },
  statNegative: {
    color: THEME.red,
  },
  cardNote: {
    marginTop: 8,
    padding: 8,
    backgroundColor: THEME.bg,
    borderRadius: 8,
  },
  cardNoteText: {
    fontSize: 13,
    color: THEME.text,
    fontStyle: 'italic',
  },
});

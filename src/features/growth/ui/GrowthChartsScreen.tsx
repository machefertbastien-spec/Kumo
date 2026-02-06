/**
 * Growth Charts Screen
 * Displays growth curves with percentile bands and child's measurements
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Metric, Sex } from '../types';
import { METRIC_LABELS, METRIC_UNITS } from '../types';
import { useGrowthData } from '../hooks/useGrowthData';
import { getRefPack } from '../ref/refData';
import { GrowthChart } from './GrowthChart';

const THEME = {
  primary: '#D48A63',
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  border: '#EFE7E1',
  green: '#D48A63',
  weight: '#D27C57',
  height: '#9FB59B',
  head: '#8FB9C3',
  red: '#E85D75',
  accent: '#E6A77D',
};

export interface GrowthChartsScreenProps {
  baby: {
    id: string;
    birthDateISO: string;
    sex: 'male' | 'female';
  };
  onOpenAddMeasurement: () => void;
}

export function GrowthChartsScreen({
  baby,
  onOpenAddMeasurement,
}: GrowthChartsScreenProps) {
  const childId = baby.id;
  const childDob = baby.birthDateISO;
  const childSex = baby.sex as Sex;
  const [selectedMetric, setSelectedMetric] = useState<Metric>('weight');
  const [showInfo, setShowInfo] = useState(false);

  const { measurements, loading, error, latestMeasurement, refetch } = useGrowthData({
    childId,
    childDob,
    childSex,
    metric: selectedMetric,
  });

  // Refetch when baby changes (e.g., after onboarding)
  useEffect(() => {
    refetch();
  }, [childId, refetch]);

  // Refetch measurements when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Also refetch when metric changes
  useEffect(() => {
    refetch();
  }, [selectedMetric, refetch]);

  // Get reference data for chart
  const refPack = useMemo(() => {
    try {
      return getRefPack(childSex, selectedMetric);
    } catch {
      return null;
    }
  }, [childSex, selectedMetric]);

  // Format percentile for display
  const formatPercentile = (p: number): string => {
    if (!isFinite(p)) return '—';
    if (p < 3) return '< 3e';
    if (p > 97) return '> 97e';
    return `${Math.round(p)}e`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Croissance</Text>
          <Pressable style={styles.infoButton} onPress={() => setShowInfo(true)}>
            <Text style={styles.infoButtonText}>💡</Text>
          </Pressable>
        </View>

        {/* Metric Selector */}
        <View style={styles.metricSelector}>
          {(['weight', 'length'] as Metric[]).map(metric => (
            <Pressable
              key={metric}
              style={[
                styles.metricButton,
                selectedMetric === metric && styles.metricButtonActive,
              ]}
              onPress={() => setSelectedMetric(metric)}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  selectedMetric === metric && styles.metricButtonTextActive,
                ]}
              >
                {metric === 'weight' ? 'Poids' : 'Taille'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={THEME.primary} />
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* Latest Measurement Card */}
        {!loading && !error && latestMeasurement && (
          <View style={styles.latestCard}>
            <Text style={styles.latestLabel}>Dernière mesure</Text>
            <View style={styles.latestRow}>
              <View style={styles.latestValue}>
                <Text style={styles.latestNumber}>
                  {latestMeasurement.measurement.value}
                </Text>
                <Text style={styles.latestUnit}>{METRIC_UNITS[selectedMetric]}</Text>
              </View>
              <View style={styles.latestStats}>
                <Text style={styles.latestDate}>
                  {format(new Date(latestMeasurement.measurement.measuredAt), 'dd MMM yyyy', { locale: fr })}
                </Text>
                <Text style={styles.latestPercentile}>
                  Percentile: {formatPercentile(latestMeasurement.percentile)}
                </Text>
                <Text style={styles.latestAge}>
                  {latestMeasurement.ageDays} jours
                </Text>
              </View>
            </View>
            {latestMeasurement.deltaValue !== undefined && (
              <Text style={styles.latestDelta}>
                {latestMeasurement.deltaValue > 0 ? '+' : ''}
                {latestMeasurement.deltaValue} {METRIC_UNITS[selectedMetric]} en {latestMeasurement.deltaDays} jours
              </Text>
            )}
          </View>
        )}

        {/* Chart */}
        {refPack && (
          <View style={styles.chartCard}>
            {measurements.length === 0 ? (
              <View>
                <Text style={styles.chartPlaceholder}>
                  📊 Graphique de croissance avec bandes percentiles
                </Text>
                <Text style={styles.chartHint}>
                  Ajoutez une mesure pour voir l'évolution sur le graphique
                </Text>
              </View>
            ) : (
              <GrowthChart
                measurements={measurements}
                bands={refPack.bands}
                metric={selectedMetric}
                childDob={childDob}
              />
            )}
          </View>
        )}

        {!refPack && (
          <View style={styles.chartCard}>
            <Text style={styles.errorText}>
              ❌ Données de référence non disponibles pour ce sexe/métrique
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <Pressable style={styles.addButton} onPress={onOpenAddMeasurement}>
        <Text style={styles.addButtonText}>+ Ajouter une mesure</Text>
      </Pressable>

      {/* Info Modal */}
      <Modal
        visible={showInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfo(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowInfo(false)}>
          <View style={styles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.infoModal}>
                <View style={styles.infoModalHeader}>
                  <Text style={styles.infoModalTitle}>💡 À savoir</Text>
                  <Pressable style={styles.closeButton} onPress={() => setShowInfo(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>
                <Text style={styles.infoModalText}>
                  • Les courbes sont basées sur les standards OMS 0-12 mois{'\n\n'}
                  • Le percentile indique la position par rapport aux autres enfants{'\n\n'}
                  • Un percentile stable dans le temps est généralement bon signe{'\n\n'}
                  • En cas de doute, consultez votre pédiatre
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 110,
  },
  header: {
    paddingVertical: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'left',
  },
  infoButton: {
    position: 'absolute',
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.border,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoButtonText: {
    fontSize: 18,
  },
  metricSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  metricButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: THEME.border,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  metricButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  metricButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.darkGray,
  },
  metricButtonTextActive: {
    color: THEME.card,
    fontWeight: '700',
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    marginVertical: 16,
  },
  errorText: {
    color: THEME.red,
    fontSize: 14,
  },
  latestCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  latestLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.muted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  latestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  latestValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  latestNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: THEME.primary,
  },
  latestUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.muted,
    marginLeft: 4,
  },
  latestStats: {
    alignItems: 'flex-end',
  },
  latestDate: {
    fontSize: 14,
    color: THEME.text,
    marginBottom: 4,
  },
  latestPercentile: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.green,
    marginBottom: 2,
  },
  latestAge: {
    fontSize: 12,
    color: THEME.muted,
  },
  latestDelta: {
    fontSize: 13,
    color: THEME.muted,
    marginTop: 12,
    fontStyle: 'italic',
  },
  chartCard: {
    backgroundColor: THEME.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 24,
  },
  chartPlaceholder: {
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 40,
  },
  chartHint: {
    fontSize: 13,
    color: THEME.muted,
    textAlign: 'center',
  },
  chartLegend: {
    marginTop: 20,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: THEME.text,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: THEME.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.card,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
  },
  infoModal: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  infoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingRight: 4,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
    flex: 1,
    paddingRight: 12,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  closeButtonText: {
    fontSize: 18,
    color: THEME.muted,
    fontWeight: '600',
  },
  infoModalText: {
    fontSize: 15,
    color: THEME.text,
    lineHeight: 24,
  },
});

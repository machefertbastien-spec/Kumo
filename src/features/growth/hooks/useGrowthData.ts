/**
 * useGrowthData Hook
 * Manages growth measurements with computed statistics
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Measurement, Metric, MeasurementWithStats, Sex } from '../types';
import { loadMeasurements } from '../storage/measurementsRepo';
import { getRefPack } from '../ref/refData';
import { ageDays, lmsAtDay, zFromLMS, percentileFromZ, calculateDelta } from '../math/growthMath';

interface UseGrowthDataProps {
  childId: string;
  childDob: string;
  childSex: Sex;
  metric: Metric;
}

interface UseGrowthDataReturn {
  measurements: MeasurementWithStats[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  latestMeasurement: MeasurementWithStats | null;
}

export function useGrowthData({
  childId,
  childDob,
  childSex,
  metric,
}: UseGrowthDataProps): UseGrowthDataReturn {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch measurements
  const fetchMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const all = await loadMeasurements(childId);
      const filtered = all.filter(m => m.type === metric);
      
      // Sort by measured date (newest first)
      filtered.sort((a, b) => 
        new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
      );
      
      setMeasurements(filtered);
    } catch (err) {
      console.error('[useGrowthData] Failed to load measurements:', err);
      setError('Impossible de charger les mesures');
    } finally {
      setLoading(false);
    }
  }, [childId, metric]);

  // Initial load
  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  // Compute stats for measurements
  const measurementsWithStats = useMemo<MeasurementWithStats[]>(() => {
    if (measurements.length === 0) {
      // Clear any previous error if no measurements
      setError(null);
      return [];
    }

    try {
      const refPack = getRefPack(childSex, metric);
      
      return measurements.map((measurement, index) => {
        const days = ageDays(childDob, measurement.measuredAt);
        const lms = lmsAtDay(refPack.lms, days);
        const z = zFromLMS(measurement.value, lms);
        const percentile = percentileFromZ(z);

        // Calculate delta vs previous measurement (next in array since sorted desc)
        const previous = measurements[index + 1];
        let deltaValue: number | undefined;
        let deltaDays: number | undefined;

        if (previous) {
          const delta = calculateDelta(
            measurement.value,
            previous.value,
            measurement.measuredAt,
            previous.measuredAt
          );
          deltaValue = delta.deltaValue;
          deltaDays = delta.deltaDays;
        }

        return {
          measurement,
          ageDays: days,
          zScore: z,
          percentile,
          deltaValue,
          deltaDays,
        };
      });
    } catch (err) {
      console.error('[useGrowthData] Failed to compute stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de calcul des statistiques';
      setError(errorMessage);
      return [];
    }
  }, [measurements, childDob, childSex, metric]);

  // Latest measurement
  const latestMeasurement = useMemo<MeasurementWithStats | null>(() => {
    return measurementsWithStats[0] || null;
  }, [measurementsWithStats]);

  return {
    measurements: measurementsWithStats,
    loading,
    error,
    refetch: fetchMeasurements,
    latestMeasurement,
  };
}

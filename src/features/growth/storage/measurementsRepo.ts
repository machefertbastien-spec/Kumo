/**
 * Measurements Repository - AsyncStorage CRUD
 * Stores child growth measurements locally
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Measurement, Metric } from '../types';

const STORAGE_KEY_PREFIX = 'growth_measurements_';

/**
 * Generate unique ID for measurements
 */
function generateId(): string {
  return `measure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get storage key for a child's measurements
 */
function getStorageKey(childId: string): string {
  return `${STORAGE_KEY_PREFIX}${childId}`;
}

/**
 * Load all measurements for a child
 */
export async function loadMeasurements(childId: string): Promise<Measurement[]> {
  try {
    const key = getStorageKey(childId);
    const json = await AsyncStorage.getItem(key);
    
    if (!json) return [];
    
    const measurements: Measurement[] = JSON.parse(json);
    return measurements.sort((a, b) => 
      new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
    );
  } catch (error) {
    console.error('[GrowthRepo] Failed to load measurements:', error);
    return [];
  }
}

/**
 * Save measurements array (internal helper)
 */
async function saveMeasurements(childId: string, measurements: Measurement[]): Promise<void> {
  const key = getStorageKey(childId);
  await AsyncStorage.setItem(key, JSON.stringify(measurements));
}

/**
 * Add a new measurement
 */
export async function addMeasurement(
  childId: string,
  type: Metric,
  value: number,
  measuredAt: string,
  source?: 'home' | 'doctor',
  note?: string
): Promise<Measurement> {
  const measurements = await loadMeasurements(childId);
  
  const now = new Date().toISOString();
  const newMeasurement: Measurement = {
    id: generateId(),
    childId,
    type,
    value,
    measuredAt,
    source,
    note,
    createdAt: now,
    updatedAt: now,
  };
  
  measurements.push(newMeasurement);
  await saveMeasurements(childId, measurements);
  
  return newMeasurement;
}

/**
 * Update an existing measurement
 */
export async function updateMeasurement(
  childId: string,
  measurementId: string,
  updates: Partial<Pick<Measurement, 'value' | 'measuredAt' | 'source' | 'note'>>
): Promise<Measurement | null> {
  const measurements = await loadMeasurements(childId);
  const index = measurements.findIndex(m => m.id === measurementId);
  
  if (index === -1) return null;
  
  measurements[index] = {
    ...measurements[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveMeasurements(childId, measurements);
  return measurements[index];
}

/**
 * Delete a measurement
 */
export async function deleteMeasurement(childId: string, measurementId: string): Promise<boolean> {
  const measurements = await loadMeasurements(childId);
  const filtered = measurements.filter(m => m.id !== measurementId);
  
  if (filtered.length === measurements.length) {
    return false; // Not found
  }
  
  await saveMeasurements(childId, filtered);
  return true;
}

/**
 * Get measurements filtered by type
 */
export async function getMeasurementsByType(childId: string, type: Metric): Promise<Measurement[]> {
  const all = await loadMeasurements(childId);
  return all.filter(m => m.type === type);
}

/**
 * Get latest measurement of a specific type
 */
export async function getLatestMeasurement(childId: string, type: Metric): Promise<Measurement | null> {
  const measurements = await getMeasurementsByType(childId, type);
  return measurements[0] || null;
}

/**
 * Delete all measurements for a child (cleanup)
 */
export async function deleteAllMeasurements(childId: string): Promise<void> {
  const key = getStorageKey(childId);
  await AsyncStorage.removeItem(key);
}

/**
 * Get count of measurements by type
 */
export async function getMeasurementCount(childId: string): Promise<Record<Metric, number>> {
  const all = await loadMeasurements(childId);
  
  return {
    weight: all.filter(m => m.type === 'weight').length,
    length: all.filter(m => m.type === 'length').length,
    headCircumference: all.filter(m => m.type === 'headCircumference').length,
  };
}

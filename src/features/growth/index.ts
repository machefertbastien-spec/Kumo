/**
 * Growth Feature - Public API
 * Main exports for the growth tracking feature
 */

// UI Components
export { GrowthChartsScreen } from './ui/GrowthChartsScreen';
export { GrowthHistoryScreen } from './ui/GrowthHistoryScreen';
export { AddMeasurementSheet } from './ui/AddMeasurementSheet';
export { GrowthChart } from './ui/GrowthChart';

// Hooks
export { useGrowthData } from './hooks/useGrowthData';

// Storage
export {
  loadMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getMeasurementsByType,
  getLatestMeasurement,
} from './storage/measurementsRepo';

// Types
export type {
  Sex,
  Metric,
  Measurement,
  MeasurementSource,
  MeasurementWithStats,
  LMS,
  Bands,
  RefPack,
} from './types';

export {
  METRIC_LABELS,
  METRIC_UNITS,
  VALIDATION_BOUNDS,
} from './types';

// Math utilities (if needed externally)
export {
  ageDays,
  zFromLMS,
  xFromLMS,
  percentileFromZ,
  isValidMeasurement,
} from './math/growthMath';

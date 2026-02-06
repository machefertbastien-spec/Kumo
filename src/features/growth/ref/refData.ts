/**
 * Reference Data Loader
 * Loads WHO LMS parameters and pre-calculated percentile bands
 */

import type { Bands, LMSByDay, Sex, Metric, RefPack } from '../types';

/**
 * Convert metric to short filename format
 */
function metricToShortName(metric: Metric): string {
  return metric === 'headCircumference' ? 'hc' : metric;
}

/**
 * Generate key for sex + metric combination
 */
function getKey(sex: Sex, metric: Metric): string {
  const shortMetric = metricToShortName(metric);
  return `${sex}.${shortMetric}`;
}

/**
 * Lazy-loaded LMS data (imported statically for better bundling)
 */
const LMS_DATA: Record<string, LMSByDay> = {
  'female.weight': require('./lms/female.weight.lms.json'),
  'female.length': require('./lms/female.length.lms.json'),
  'female.hc': require('./lms/female.hc.lms.json'),
  'male.weight': require('./lms/male.weight.lms.json'),
  'male.length': require('./lms/male.length.lms.json'),
  'male.hc': require('./lms/male.hc.lms.json'),
};

/**
 * Lazy-loaded bands data
 */
const BANDS_DATA: Record<string, Bands> = {
  'female.weight': require('./generated/female.weight.bands.json'),
  'female.length': require('./generated/female.length.bands.json'),
  'female.hc': require('./generated/female.hc.bands.json'),
  'male.weight': require('./generated/male.weight.bands.json'),
  'male.length': require('./generated/male.length.bands.json'),
  'male.hc': require('./generated/male.hc.bands.json'),
};

/**
 * Get reference data pack for a specific sex and metric
 * 
 * @throws Error if data is not available
 */
export function getRefPack(sex: Sex, metric: Metric): RefPack {
  const key = getKey(sex, metric);
  
  const lms = LMS_DATA[key];
  const bands = BANDS_DATA[key];
  
  if (!lms || !bands) {
    throw new Error(`Missing reference data for ${key}. Ensure LMS and bands files exist.`);
  }
  
  return { lms, bands };
}

/**
 * Check if reference data is available for sex and metric
 */
export function hasRefData(sex: Sex, metric: Metric): boolean {
  const key = getKey(sex, metric);
  return !!LMS_DATA[key] && !!BANDS_DATA[key];
}

/**
 * Get list of available metrics for a sex
 */
export function getAvailableMetrics(sex: Sex): Metric[] {
  const metrics: Metric[] = [];
  
  if (hasRefData(sex, 'weight')) metrics.push('weight');
  if (hasRefData(sex, 'length')) metrics.push('length');
  if (hasRefData(sex, 'headCircumference')) metrics.push('headCircumference');
  
  return metrics;
}

/**
 * Preload all reference data (optional optimization)
 */
export function preloadRefData(): void {
  // Data is already imported statically, this is a no-op
  // But can be used for future dynamic loading
  console.log('[RefData] Reference data preloaded');
}

/**
 * Growth Math - Z-scores, Percentiles, LMS transformations
 * Based on WHO growth standards using LMS method
 */

import type { LMS, LMSByDay } from "../types";
import { parseISODate } from "../../../utils/dateUtils";

/**
 * Clamp a number between min and max
 */
export const clamp = (n: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, n));

/**
 * Calculate age in days from DOB to measurement date
 * Clamped to 0-365 for 0-12 months range
 */
export function ageDays(dobISO: string, measuredAtISO: string): number {
  const dob = parseISODate(dobISO).getTime();
  const measured = parseISODate(measuredAtISO).getTime();
  const days = Math.floor((measured - dob) / 86400000);
  return clamp(days, 0, 365);
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Get interpolated LMS parameters for a fractional day
 * Uses linear interpolation between available integer days
 */
export function lmsAtDay(lmsByDay: LMSByDay, day: number): LMS {
  const d = clamp(day, 0, 365);
  
  // Get sorted available days
  const availableDays = Object.keys(lmsByDay).map(Number).sort((a, b) => a - b);
  
  // Find the two days that bracket the target day
  let d0 = availableDays[0];
  let d1 = availableDays[0];
  
  for (const availableDay of availableDays) {
    if (availableDay <= d) {
      d0 = availableDay;
    }
    if (availableDay >= d && d1 === availableDays[0]) {
      d1 = availableDay;
      break;
    }
  }
  
  // If day is beyond last available day, use last day's data
  if (d > availableDays[availableDays.length - 1]) {
    d0 = d1 = availableDays[availableDays.length - 1];
  }
  
  const lms0 = lmsByDay[d0];
  const lms1 = lmsByDay[d1];
  
  if (!lms0 || !lms1) {
    throw new Error(`Missing LMS data for day ${d} (available: ${d0}, ${d1})`);
  }
  
  // If both days are the same, no interpolation needed
  if (d0 === d1) {
    return lms0;
  }
  
  // Linear interpolation
  const t = (d - d0) / (d1 - d0);
  
  return {
    L: lerp(lms0.L, lms1.L, t),
    M: lerp(lms0.M, lms1.M, t),
    S: lerp(lms0.S, lms1.S, t),
  };
}

/**
 * Calculate z-score from measurement value using LMS method
 * Formula: z = ((x/M)^L - 1) / (L*S)  for L ≠ 0
 *          z = ln(x/M) / S            for L = 0
 */
export function zFromLMS(x: number, { L, M, S }: LMS): number {
  if (x <= 0 || M <= 0 || S <= 0) return NaN;
  
  if (Math.abs(L) < 0.001) {
    // L ≈ 0: use log-normal approximation
    return Math.log(x / M) / S;
  }
  
  return (Math.pow(x / M, L) - 1) / (L * S);
}

/**
 * Calculate measurement value from z-score using inverse LMS
 * Formula: x = M * (1 + L*S*z)^(1/L)  for L ≠ 0
 *          x = M * exp(S*z)            for L = 0
 */
export function xFromLMS(z: number, { L, M, S }: LMS): number {
  if (M <= 0 || S <= 0) return NaN;
  
  if (Math.abs(L) < 0.001) {
    return M * Math.exp(S * z);
  }
  
  const inside = 1 + L * S * z;
  if (inside <= 0) return NaN;
  
  return M * Math.pow(inside, 1 / L);
}

/**
 * Approximate cumulative distribution function for standard normal
 * Uses Abramowitz and Stegun approximation (error < 1.5e-7)
 */
export function normalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  
  // Error function approximation
  const t = 1 / (1 + 0.3275911 * x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  const erf = 1 - poly * Math.exp(-x * x);
  
  return 0.5 * (1 + sign * erf);
}

/**
 * Convert z-score to percentile (0-100)
 */
export function percentileFromZ(z: number): number {
  if (!isFinite(z)) return NaN;
  return normalCdf(z) * 100;
}

/**
 * Standard z-scores for common percentiles
 */
export const Z_SCORES = {
  p3: -1.8807936081512506,   // 3rd percentile
  p15: -1.0364333894937896,  // 15th percentile
  p50: 0,                    // 50th percentile (median)
  p85: 1.0364333894937896,   // 85th percentile
  p97: 1.8807936081512506,   // 97th percentile
} as const;

/**
 * Validate if a measurement value is within reasonable bounds
 */
export function isValidMeasurement(value: number, min: number, max: number): boolean {
  return isFinite(value) && value >= min && value <= max;
}

/**
 * Calculate delta between two measurements
 */
export function calculateDelta(current: number, previous: number, currentDate: string, previousDate: string) {
  const deltaValue = current - previous;
  const deltaDays = ageDays(previousDate, currentDate);
  
  return {
    deltaValue: Number(deltaValue.toFixed(2)),
    deltaDays,
    deltaPerDay: deltaDays > 0 ? Number((deltaValue / deltaDays).toFixed(3)) : 0,
  };
}



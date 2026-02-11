/**
 * Growth Charts Feature - Type Definitions
 * Tracks weight, length, and head circumference for 0-12 months
 */

export type Sex = "female" | "male";
export type Metric = "weight" | "length" | "headCircumference";

export interface Measurement {
  id: string;
  childId: string;
  type: Metric;
  value: number; // kg for weight, cm for length & headCircumference
  measuredAt: string; // ISO datetime
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// LMS parameters for WHO growth standards
export interface LMS {
  L: number; // Box-Cox power
  M: number; // Median
  S: number; // Coefficient of variation
}

export type LMSByDay = Record<number, LMS>; // day 0..365

// Pre-calculated percentile bands for chart rendering
export interface Bands {
  p3: Array<{ day: number; value: number }>;
  p15: Array<{ day: number; value: number }>;
  p50: Array<{ day: number; value: number }>;
  p85: Array<{ day: number; value: number }>;
  p97: Array<{ day: number; value: number }>;
}

export interface RefPack {
  lms: LMSByDay;
  bands: Bands;
}

// Computed metrics for display
export interface MeasurementWithStats {
  measurement: Measurement;
  ageDays: number;
  zScore: number;
  percentile: number;
  deltaValue?: number; // vs previous measurement
  deltaDays?: number;
}

// Validation bounds (reasonable ranges)
export const VALIDATION_BOUNDS = {
  weight: { min: 1.5, max: 15 }, // kg
  length: { min: 40, max: 90 }, // cm
  headCircumference: { min: 30, max: 52 }, // cm
} as const;

export const METRIC_LABELS = {
  weight: "Poids",
  length: "Taille",
  headCircumference: "Périmètre crânien",
} as const;

export const METRIC_UNITS = {
  weight: "kg",
  length: "cm",
  headCircumference: "cm",
} as const;

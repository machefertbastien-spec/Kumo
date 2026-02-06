/**
 * SleepPlanner - Sleep timing prediction constants and types
 * Predicts optimal sleep windows based on age, patterns, and user settings
 */

// ============ TYPES ============

export interface AgeWakeWindow {
  minMonths: number;
  maxMonths: number;
  baseWakeMin: number;
  defaultNaps: number;
}

export interface SleepPlannerSettings {
  babyId: string;
  bedtimeTargetHHMM: string;      // "19:30"
  napCountMode: 'auto' | '1' | '2' | '3' | '4';
  nudgeMin: number;               // -15..+15
  windowHalfWidthMin: number;     // 10..30
  notifyBeforeMin: number;        // 5..30
  enableSleepPlannerNotif: boolean;
  lastNotificationId?: string;
}

export interface SleepPlannerWindow {
  slotIndex: number;              // 0=nap1, 1=nap2, n=bedtime
  slotType: 'nap' | 'bedtime';
  earliestMs: number;
  targetMs: number;
  latestMs: number;
}

export interface SleepPlannerResult {
  window: SleepPlannerWindow | null;
  countdown: {
    status: 'too_early' | 'ideal' | 'too_late' | 'unknown';
    minutesUntil: number;
    message: string;
  };
}

// ============ AGE-BASED WAKE WINDOWS ============

export const AGE_WAKE_WINDOWS: AgeWakeWindow[] = [
  { minMonths: 2, maxMonths: 3, baseWakeMin: 75, defaultNaps: 4 },
  { minMonths: 4, maxMonths: 5, baseWakeMin: 105, defaultNaps: 4 },
  { minMonths: 6, maxMonths: 7, baseWakeMin: 135, defaultNaps: 3 },
  { minMonths: 8, maxMonths: 10, baseWakeMin: 165, defaultNaps: 2 },
  { minMonths: 11, maxMonths: 14, baseWakeMin: 195, defaultNaps: 2 },
  { minMonths: 15, maxMonths: 999, baseWakeMin: 240, defaultNaps: 1 },
];

// ============ DAY FACTORS ============

/**
 * Multipliers for each sleep slot in the day
 * Earlier naps = shorter wake windows, bedtime = longer
 */
export const DAY_FACTORS: Record<number, number[]> = {
  4: [0.9, 1.0, 1.0, 1.05, 1.1],   // 4 naps + bedtime
  3: [0.9, 1.0, 1.05, 1.1],        // 3 naps + bedtime
  2: [0.95, 1.05, 1.15],           // 2 naps + bedtime
  1: [1.0, 1.15],                  // 1 nap + bedtime
};

// ============ DEFAULTS ============

export const DEFAULT_SLEEPPLANNER_SETTINGS: Omit<SleepPlannerSettings, 'babyId'> = {
  bedtimeTargetHHMM: '19:30',
  napCountMode: 'auto',
  nudgeMin: 0,
  windowHalfWidthMin: 15,
  notifyBeforeMin: 10,
  enableSleepPlannerNotif: true,
};

// ============ CONSTANTS ============

export const MIN_EVENTS_FOR_PREDICTION = 3;
export const CALIBRATION_WINDOW_DAYS = 7;
export const MAX_CALIBRATION_DELTA_MIN = 20;
export const STALE_DATA_THRESHOLD_HOURS = 24;

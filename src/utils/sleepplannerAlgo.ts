import { differenceInMonths, startOfDay, set } from 'date-fns';
import { parseISODate } from './dateUtils';
import {
  AGE_WAKE_WINDOWS,
  DAY_FACTORS,
  MIN_EVENTS_FOR_PREDICTION,
  CALIBRATION_WINDOW_DAYS,
  MAX_CALIBRATION_DELTA_MIN,
  STALE_DATA_THRESHOLD_HOURS,
  SleepPlannerSettings,
  SleepPlannerWindow,
  SleepPlannerResult,
} from '../constants/sleepplanner';

const MIN_MS = 60 * 1000;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

// ============ HELPER FUNCTIONS ============

/**
 * Calculate baby's age in months from birth date
 * 
 * @param {string} birthDateISO - Baby's birth date in ISO 8601 format
 * @param {number} nowMs - Current time in milliseconds
 * @returns {number} Age in months (minimum 0)
 * @example
 * getAgeMonths('2024-01-15T00:00:00Z', Date.now()) // Returns months since birth
 */
function getAgeMonths(birthDateISO: string, nowMs: number): number {
  const birthDate = parseISODate(birthDateISO);
  const now = new Date(nowMs);
  return Math.max(0, differenceInMonths(now, birthDate));
}

/**
 * Get age-appropriate base wake window duration
 * 
 * Uses AGE_WAKE_WINDOWS lookup table to determine optimal wake window
 * based on developmental stage. Wake windows increase with age to match
 * increasing alertness and decreasing sleep needs.
 * 
 * @param {number} ageMonths - Baby's age in months
 * @returns {number} Base wake window in minutes (default: 180 if age not found)
 * @example
 * getBaseWakeWindow(3) // Returns ~90 minutes for 3-month-old
 * getBaseWakeWindow(6) // Returns ~120 minutes for 6-month-old
 */
function getBaseWakeWindow(ageMonths: number): number {
  const entry = AGE_WAKE_WINDOWS.find(
    (w) => ageMonths >= w.minMonths && ageMonths <= w.maxMonths
  );
  return entry?.baseWakeMin ?? 180; // fallback 3h
}

/**
 * Determine number of naps per day
 * 
 * Supports auto-detection based on age or manual override.
 * Younger babies need more frequent naps (3-4), while older babies
 * transition to 1-2 naps per day.
 * 
 * @param {number} ageMonths - Baby's age in months
 * @param {string} mode - Nap count mode: 'auto' or specific count ('1', '2', '3', '4')
 * @returns {number} Number of naps per day (1-4)
 * @example
 * getNapCount(3, 'auto') // Returns 3 naps for 3-month-old
 * getNapCount(10, '2')   // Returns 2 (manual override)
 */
function getNapCount(ageMonths: number, mode: SleepPlannerSettings['napCountMode']): number {
  if (mode !== 'auto') {
    return parseInt(mode, 10);
  }
  
  const entry = AGE_WAKE_WINDOWS.find(
    (w) => ageMonths >= w.minMonths && ageMonths <= w.maxMonths
  );
  return entry?.defaultNaps ?? 2;
}

/**
 * Get wake window multipliers for each nap slot
 * 
 * Returns array of factors to adjust base wake window throughout the day.
 * Typically first wake window is shorter (baby just woke up) and last
 * wake window before bedtime is longer.
 * 
 * @param {number} napCount - Number of naps per day
 * @returns {number[]} Array of multipliers, one per slot (length = napCount + 1)
 * @example
 * getDayFactors(2) // Returns [0.8, 1.0, 1.2] for morning, midday, bedtime
 */
function getDayFactors(napCount: number): number[] {
  return DAY_FACTORS[napCount] ?? [1.0, 1.15]; // fallback 1 nap
}

/**
 * Find the most recent wake time from sleep events
 * 
 * Searches through all completed sleep sessions to find when baby
 * last woke up. This is critical for calculating when the next
 * sleep window should occur.
 * 
 * @param {Array} events - Array of all events (filtered for sleep type)
 * @param {number} nowMs - Current time in milliseconds (unused but kept for consistency)
 * @returns {number|null} Timestamp of last wake (endTs) or null if no sleep events
 */
function getLastWakeTime(events: any[], nowMs: number): number | null {
  const sleepEvents = events
    .filter((e) => e.type === 'sleep' && !e.deletedAt && e.endTs)
    .sort((a, b) => b.endTs! - a.endTs!);
  
  if (sleepEvents.length === 0) return null;
  
  const lastSleep = sleepEvents[0];
  return lastSleep.endTs!;
}

/**
 * Determine which nap slot we're currently in
 * 
 * Counts completed sleep sessions since start of day to determine
 * if we're predicting nap #1, #2, #3, or bedtime. Used to apply
 * correct day factor and calibration.
 * 
 * @param {Array} events - Array of all events
 * @param {number} nowMs - Current time in milliseconds
 * @param {number} napCount - Total naps per day
 * @returns {number} Current slot index (0 = first nap, napCount = bedtime)
 * @example
 * getCurrentSlotIndex(events, now, 3) // Returns 0-3 (nap 1, 2, 3, or bedtime)
 */
function getCurrentSlotIndex(events: any[], nowMs: number, napCount: number): number {
  const todayStart = startOfDay(new Date(nowMs)).getTime();
  const todayEvents = events
    .filter((e) => e.type === 'sleep' && !e.deletedAt && e.startTs && e.endTs)
    .filter((e) => e.startTs >= todayStart)
    .sort((a, b) => a.startTs - b.startTs);
  
  return todayEvents.length; // 0=first nap, napCount=bedtime
}

/**
 * Calculate statistical median of numeric array
 * 
 * Used for calibration to find typical wake window from recent data.
 * Median is more robust to outliers than mean (e.g., unusually long/short naps).
 * 
 * @param {number[]} arr - Array of numbers
 * @returns {number} Median value (middle element or average of two middle elements)
 * @example
 * median([90, 100, 110, 120, 200]) // Returns 110 (outlier 200 doesn't skew result)
 * median([100, 110]) // Returns 105 (average of two middle values)
 */
function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calibrate wake window using recent sleep history
 * 
 * Analyzes recent sleep patterns for the specific slot (e.g., morning nap)
 * and calculates adjustment delta. Uses statistical median to find typical
 * wake window, then compares to age-based default. Returns clamped delta
 * to avoid extreme adjustments.
 * 
 * Algorithm:
 * 1. Filter sleep events from last CALIBRATION_WINDOW_DAYS days
 * 2. Extract wake windows (time between end of sleep N and start of sleep N+1)
 * 3. Group by slot index (morning, midday, afternoon, bedtime)
 * 4. Calculate median observed wake window for this slot
 * 5. Compare to default and return clamped delta
 * 
 * @param {Array} events - Array of all events
 * @param {number} slotIndex - Which nap slot to calibrate (0 = first nap)
 * @param {number} defaultTargetMin - Age-based default wake window in minutes
 * @param {number} nowMs - Current time in milliseconds
 * @returns {number} Calibration delta in minutes (clamped to ±MAX_CALIBRATION_DELTA_MIN)
 * @example
 * calibrateSlot(events, 0, 90, now) // Returns delta like +15 if baby typically awake 105min
 */
function calibrateSlot(
  events: any[],
  slotIndex: number,
  defaultTargetMin: number,
  nowMs: number
): number {
  const cutoff = nowMs - CALIBRATION_WINDOW_DAYS * DAY_MS;
  const recentEvents = events
    .filter((e) => e.type === 'sleep' && !e.deletedAt && e.startTs && e.endTs)
    .filter((e) => e.endTs! > cutoff)
    .sort((a, b) => a.startTs - b.startTs);
  
  // Group by day and extract wake windows for this slot
  const wakeWindows: number[] = [];
  
  for (let i = 0; i < recentEvents.length - 1; i++) {
    const curr = recentEvents[i];
    const next = recentEvents[i + 1];
    
    // Determine slot of next sleep
    const dayStart = startOfDay(new Date(next.startTs)).getTime();
    const eventsBeforeNext = recentEvents.filter(
      (e) => e.startTs >= dayStart && e.startTs < next.startTs
    );
    
    if (eventsBeforeNext.length === slotIndex) {
      const wakeWindowMs = next.startTs - curr.endTs!;
      const wakeWindowMin = wakeWindowMs / MIN_MS;
      wakeWindows.push(wakeWindowMin);
    }
  }
  
  if (wakeWindows.length < MIN_EVENTS_FOR_PREDICTION) {
    return 0; // insufficient data
  }
  
  const observedMedian = median(wakeWindows);
  const delta = observedMedian - defaultTargetMin;
  
  // Clamp delta to avoid extreme adjustments
  return Math.max(-MAX_CALIBRATION_DELTA_MIN, Math.min(MAX_CALIBRATION_DELTA_MIN, delta));
}

/**
 * Convert time string to today's timestamp
 * 
 * Parses "HH:MM" format and creates timestamp for that time today.
 * Used for bedtime target override.
 * 
 * @param {string} hhmmString - Time in "HH:MM" 24-hour format (e.g., "19:30")
 * @param {number} nowMs - Current time in milliseconds (used for date context)
 * @returns {number} Timestamp in milliseconds for the specified time today
 * @example
 * getTodayTimeMs("19:30", Date.now()) // Returns timestamp for 7:30 PM today
 */
function getTodayTimeMs(hhmmString: string, nowMs: number): number {
  try {
    const today = new Date(nowMs);
    const [hours, minutes] = hhmmString.split(':').map(Number);
    
    const target = set(today, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });
    
    return target.getTime();
  } catch {
    return nowMs;
  }
}

/**
 * Build countdown message and status for sweet spot window
 * 
 * Generates user-friendly countdown message based on current time
 * relative to the target sleep window. Provides status indicator
 * for UI styling (green/yellow/red zones).
 * 
 * @param {Object} window - Sweet spot window with earliest, target, latest timestamps
 * @param {number} nowMs - Current time in milliseconds
 * @returns {Object} Countdown result with status, minutesUntil, and message
 * @returns {string} return.status - 'too_early' | 'ideal' | 'too_late' | 'unknown'
 * @returns {number} return.minutesUntil - Minutes until target time (negative if past)
 * @returns {string} return.message - French user-facing countdown message
 * @example
 * buildCountdown({earliestMs: now+30m, targetMs: now+60m}, now)
 * // Returns {status: 'too_early', minutesUntil: 60, message: 'Trop tôt • Idéal dans 60 min'}
 */
function buildCountdown(window: SleepPlannerWindow, nowMs: number): SleepPlannerResult['countdown'] {
  const minutesUntil = Math.round((window.targetMs - nowMs) / MIN_MS);
  
  let status: SleepPlannerResult['countdown']['status'];
  let message: string;
  
  if (nowMs < window.earliestMs) {
    status = 'too_early';
    message = `Trop tôt • Idéal dans ${Math.abs(Math.round((window.targetMs - nowMs) / MIN_MS))} min`;
  } else if (nowMs >= window.earliestMs && nowMs <= window.latestMs) {
    status = 'ideal';
    if (nowMs < window.targetMs) {
      message = `✅ Idéal dans ${Math.abs(minutesUntil)} min`;
    } else {
      message = `✅ C'est le moment idéal`;
    }
  } else {
    status = 'too_late';
    message = `En retard de ${Math.abs(minutesUntil)} min`;
  }
  
  return { status, minutesUntil, message };
}

// ============ MAIN FUNCTION ============

/**
 * Compute next optimal sleep window (sweet spot) for baby
 * 
 * Main algorithm that combines age-based wake windows, historical data calibration,
 * and user preferences to predict the ideal time for next sleep. Uses statistical
 * analysis of recent sleep patterns to personalize recommendations.
 * 
 * **Algorithm Steps:**
 * 1. **Age Analysis**: Determine baby's age and lookup base wake window
 * 2. **Nap Detection**: Determine if predicting nap or bedtime
 * 3. **Last Wake Time**: Find when baby last woke up
 * 4. **Slot Identification**: Determine which nap in sequence (1st, 2nd, 3rd)
 * 5. **Day Factor**: Apply time-of-day multiplier to wake window
 * 6. **Calibration**: Analyze recent data to adjust for baby's patterns
 * 7. **User Nudge**: Apply manual adjustment from settings
 * 8. **Bedtime Override**: Use fixed bedtime for last sleep of day
 * 9. **Window Generation**: Create time window (earliest, target, latest)
 * 10. **Countdown**: Generate user-friendly status message
 * 
 * **Data Requirements:**
 * - Minimum MIN_EVENTS_FOR_PREDICTION sleep events
 * - At least one completed sleep session today
 * - Data not older than STALE_DATA_THRESHOLD_HOURS
 * 
 * **Calibration Logic:**
 * Uses last CALIBRATION_WINDOW_DAYS of sleep data to calculate typical
 * wake windows for each nap slot. Adjusts age-based defaults by up to
 * ±MAX_CALIBRATION_DELTA_MIN to match baby's actual patterns.
 * 
 * @param {Object} baby - Baby profile with birthDateISO
 * @param {Array} sleepEvents - Array of all sleep events
 * @param {Object} settings - Sleep planner configuration
 * @param {string} settings.napCountMode - 'auto' or manual count ('1'-'4')
 * @param {number} settings.nudgeMin - Manual adjustment in minutes (±)
 * @param {string} settings.bedtimeTargetHHMM - Fixed bedtime (e.g., "19:30")
 * @param {number} settings.windowHalfWidthMin - Sweet spot window half-width
 * @param {number} nowMs - Current time in milliseconds
 * @returns {Object} Sleep planner result
 * @returns {Object|null} return.window - Sweet spot window (null if insufficient data)
 * @returns {number} return.window.slotIndex - Which nap (0-based)
 * @returns {string} return.window.slotType - 'nap' | 'bedtime'
 * @returns {number} return.window.earliestMs - Window start timestamp
 * @returns {number} return.window.targetMs - Optimal target timestamp
 * @returns {number} return.window.latestMs - Window end timestamp
 * @returns {Object} return.countdown - Countdown status and message
 * 
 * @example
 * const result = computeNextSleepPlan(
 *   { birthDateISO: '2024-06-01T00:00:00Z' },
 *   sleepEvents,
 *   { napCountMode: 'auto', nudgeMin: 0, bedtimeTargetHHMM: '19:30', windowHalfWidthMin: 15 },
 *   Date.now()
 * );
 * // Returns: { window: { slotIndex: 1, slotType: 'nap', earliestMs, targetMs, latestMs }, countdown: {...} }
 */
export function computeNextSleepPlan(
  baby: any,
  sleepEvents: any[],
  settings: SleepPlannerSettings,
  nowMs: number
): SleepPlannerResult {
  // Empty state checks
  if (!baby || sleepEvents.length < MIN_EVENTS_FOR_PREDICTION) {
    return {
      window: null,
      countdown: {
        status: 'unknown',
        minutesUntil: 0,
        message: 'Pas assez de données',
      },
    };
  }
  
  // 1. Get age and base parameters
  const ageMonths = getAgeMonths(baby.birthDateISO, nowMs);
  const baseWakeMin = getBaseWakeWindow(ageMonths);
  const napCount = getNapCount(ageMonths, settings.napCountMode);
  const dayFactors = getDayFactors(napCount);
  
  // 2. Find last wake time
  const lastWakeMs = getLastWakeTime(sleepEvents, nowMs);
  if (!lastWakeMs) {
    return {
      window: null,
      countdown: {
        status: 'unknown',
        minutesUntil: 0,
        message: 'Aucun réveil enregistré',
      },
    };
  }
  
  // Check if data is stale
  const hoursSinceWake = (nowMs - lastWakeMs) / HOUR_MS;
  if (hoursSinceWake > STALE_DATA_THRESHOLD_HOURS) {
    return {
      window: null,
      countdown: {
        status: 'unknown',
        minutesUntil: 0,
        message: 'Données obsolètes',
      },
    };
  }
  
  // 3. Determine current slot
  const currentSlot = getCurrentSlotIndex(sleepEvents, nowMs, napCount);
  
  // If we've done all naps + bedtime today, return empty
  if (currentSlot > napCount) {
    return {
      window: null,
      countdown: {
        status: 'unknown',
        minutesUntil: 0,
        message: 'Journée terminée',
      },
    };
  }
  
  // 4. Calculate target wake window
  const slotFactor = dayFactors[currentSlot] ?? 1.0;
  const defaultTargetMin = baseWakeMin * slotFactor;
  
  // 5. Calibrate
  const calibrationDelta = calibrateSlot(sleepEvents, currentSlot, defaultTargetMin, nowMs);
  
  // 6. Apply nudge
  const adjustedWakeMin = defaultTargetMin + calibrationDelta + settings.nudgeMin;
  let targetMs = lastWakeMs + adjustedWakeMin * MIN_MS;
  
  // 7. Override with bedtime if last slot
  const isLastSlot = currentSlot === napCount;
  if (isLastSlot && settings.bedtimeTargetHHMM) {
    targetMs = getTodayTimeMs(settings.bedtimeTargetHHMM, nowMs);
  }
  
  // 8. Build window
  const halfWidth = settings.windowHalfWidthMin * MIN_MS;
  const window: SleepPlannerWindow = {
    slotIndex: currentSlot,
    slotType: isLastSlot ? 'bedtime' : 'nap',
    earliestMs: targetMs - halfWidth,
    targetMs,
    latestMs: targetMs + halfWidth,
  };
  
  // 9. Build countdown
  const countdown = buildCountdown(window, nowMs);
  
  return { window, countdown };
}


import { differenceInDays } from "date-fns";
import { TIME_CONSTANTS } from "../constants/theme";

const { MINUTE_MS, HOUR_MS, DAY_MS } = TIME_CONSTANTS;

/**
 * Date and Time Utility Functions
 */

/**
 * Generate a unique ID using timestamp and random string
 * @returns {string} Unique identifier
 */
export function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Round a number to 1 decimal place
 * @param {number} x - Number to round
 * @returns {number} Rounded number
 */
export function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

/**
 * Convert milliseconds to hours
 * @param {number} ms - Milliseconds
 * @returns {number} Hours (decimal)
 */
export function msToHours(ms: number): number {
  return ms / HOUR_MS;
}

/**
 * Format a Date as YYYY-MM-DD using local time (avoids TZ shifts)
 */
export function toLocalDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse ISO date string. If it's YYYY-MM-DD, treat as local date.
 */
export function parseISODate(value: string | null | undefined): Date {
  if (!value) return new Date(NaN);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}
/**
 * Format time elapsed since an event as a short string
 * Examples: "5 min", "2h30", "3j12h"
 * 
 * @param {number} fromMs - Start time in milliseconds
 * @param {number} nowMs - Current time in milliseconds
 * @returns {string} Formatted time string
 */
export function agoShort(fromMs: number, nowMs: number): string {
  if (!fromMs) return "—";
  
  const diff = Math.max(0, nowMs - fromMs);
  const mins = Math.floor(diff / MINUTE_MS);
  
  // Less than 1 hour: show minutes
  if (mins < 60) {
    return `${mins} min`;
  }
  
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  
  // Less than 1 day: show hours and minutes
  if (h < 24) {
    return m === 0 ? `${h}h` : `${h}h${m}`;
  }
  
  // More than 1 day: show days and hours
  const d = Math.floor(h / 24);
  const hr = h % 24;
  return hr === 0 ? `${d}j` : `${d}j${hr}h`;
}

/**
 * Calculate baby's age from birth date
 * @param {string} birthISO - Birth date in ISO 8601 format
 * @returns {string} Age label (e.g., "15 jours" or "3 mois")
 */
export function babyAgeLabel(birthISO: string): string {
  if (!birthISO) return "";
  
  const birth = parseISODate(birthISO);
  if (!isFinite(birth.getTime())) return "";
  const days = Math.max(0, differenceInDays(new Date(), birth));
  const months = Math.floor(days / 30.44); // Average days per month
  
  if (months <= 0) {
    return `${days} jours`;
  }
  
  return `${months} mois`;
}

/**
 * Check if a given date falls within quiet hours
 * @param {Date} date - Date to check
 * @param {number} quietStartHour - Quiet hours start (0-23)
 * @param {number} quietEndHour - Quiet hours end (0-23)
 * @returns {boolean} True if in quiet hours
 */
export function isInQuietHours(date: Date, quietStartHour: number, quietEndHour: number): boolean {
  const h = date.getHours();
  
  // No quiet hours if start equals end
  if (quietStartHour === quietEndHour) return false;
  
  // Normal range (e.g., 8-17): check if h is between start and end
  if (quietStartHour < quietEndHour) {
    return h >= quietStartHour && h < quietEndHour;
  }
  
  // Overnight range (e.g., 22-7): check if h is after start OR before end
  return h >= quietStartHour || h < quietEndHour;
}

/**
 * Calculate the next allowed time outside of quiet hours
 * If the given time is not in quiet hours, returns it unchanged.
 * Otherwise, adjusts to the end of quiet hours.
 * 
 * @param {number} fireAtMs - Desired fire time in milliseconds
 * @param {number} quietStartHour - Quiet hours start (0-23)
 * @param {number} quietEndHour - Quiet hours end (0-23)
 * @returns {number} Adjusted time in milliseconds
 */
export function nextAllowedTimeMs(fireAtMs: number, quietStartHour: number, quietEndHour: number): number {
  const d = new Date(fireAtMs);
  
  // If not in quiet hours, return as-is
  if (!isInQuietHours(d, quietStartHour, quietEndHour)) {
    return fireAtMs;
  }
  
  // Adjust to the end of quiet hours
  const candidate = new Date(fireAtMs);
  candidate.setHours(quietEndHour, 0, 0, 0);
  
  // If end time is earlier than fire time, move to next day
  if (candidate.getTime() <= fireAtMs) {
    candidate.setDate(candidate.getDate() + 1);
  }
  
  return candidate.getTime();
}


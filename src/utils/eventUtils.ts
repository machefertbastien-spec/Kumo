import { THEME, DIAPER_TYPES } from "../constants/theme";
import { Event } from "../types";

/**
 * Event Utility Functions
 * Helper functions for event manipulation and formatting
 */

/**
 * Get label for diaper type
 * @param {string} t - Diaper type ('pee' | 'poo' | 'mixed')
 * @returns {string} French label
 */
export function diaperLabel(t: string): string {
  if (t === DIAPER_TYPES.PEE) return "Pipi";
  if (t === DIAPER_TYPES.POO) return "Caca";
  return "Mixte";
}

/**
 * Generate a display title for an event
 * @param {Object} e - Event object
 * @returns {string} Formatted title
 */
export function eventTitle(e: Event): string {
  if (e.type === "feeding") {
    return `Repas • ${e.amountMl ?? "?"} ml`;
  }
  if (e.type === "diaper") {
    return `Couche • ${diaperLabel(e.diaperType)}`;
  }
  if (e.type === "sleep") {
    return e.endTs ? "Dodo • terminé" : "Dodo • en cours";
  }
  return "Événement";
}

/**
 * Get icon configuration for an event type
 * @param {Object} e - Event object
 * @returns {{name: string, bg: string, color: string}} Icon config
 */
export function eventIcon(e: Event): { name: string; bg: string; color: string } {
  if (e.type === "sleep") {
    return {
      name: "moon-outline",
      bg: THEME.iconBgPurple,
      color: "#7B61C9",
    };
  }
  if (e.type === "feeding") {
    return {
      name: "cafe-outline",
      bg: THEME.iconBgTeal,
      color: "#2AA7B8",
    };
  }
  // Default: diaper
  return {
    name: "water-outline",
    bg: THEME.iconBgYellow,
    color: "#D5A02F",
  };
}

/**
 * Calculate total sleep duration within a time range
 * Handles ongoing sleep sessions and overlapping ranges
 * 
 * @param {Array} events - Array of all events
 * @param {number} rangeStartMs - Start of time range (milliseconds)
 * @param {number} rangeEndMs - End of time range (milliseconds)
 * @returns {number} Total sleep duration in milliseconds
 */
export function calcSleepTotalBetween(events: Event[], rangeStartMs: number, rangeEndMs: number): number {
  let total = 0;
  
  for (const e of events) {
    // Skip non-sleep or deleted events
    if (e.type !== "sleep" || e.deletedAt) continue;
    
    // Get start and end times (use current time if still sleeping)
    const s = e.startTs ?? e.ts;
    const end = e.endTs ?? Date.now();
    
    // Skip if event is outside the range
    if (end <= rangeStartMs) continue;
    if (s >= rangeEndMs) continue;
    
    // Calculate overlapping portion
    const from = Math.max(s, rangeStartMs);
    const to = Math.min(end, rangeEndMs);
    total += Math.max(0, to - from);
  }
  
  return total;
}

/**
 * Filter events by type and date range
 * @param {Array} events - Array of all events
 * @param {string} type - Event type to filter
 * @param {number} startMs - Start timestamp
 * @param {number} endMs - End timestamp
 * @returns {Array} Filtered events
 */
export function filterEventsByTypeAndDate(events: Event[], type: string, startMs: number, endMs: number): Event[] {
  return events.filter((e) => {
    if (e.deletedAt) return false;
    if (e.type !== type) return false;
    if (e.ts < startMs || e.ts >= endMs) return false;
    return true;
  });
}

/**
 * Get the most recent event of a specific type
 * @param {Array} events - Array of all events
 * @param {string} type - Event type to find
 * @returns {Object|null} Most recent event or null
 */
export function getLastEventOfType(events: Event[], type: string): Event | null {
  const filtered = events
    .filter((e) => e.type === type && !e.deletedAt)
    .sort((a, b) => b.ts - a.ts);
  
  return filtered[0] || null;
}

/**
 * Check if there's an ongoing sleep session
 * @param {Array} events - Array of all events
 * @returns {Object|null} Active sleep event or null
 */
export function getActiveSleepSession(events: Event[]): Event | null {
  return events.find(
    (e) => e.type === "sleep" && !e.endTs && !e.deletedAt
  ) || null;
}

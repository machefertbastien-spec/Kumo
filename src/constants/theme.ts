/**
 * Application Theme Configuration
 * 
 * Defines the color palette and visual style for the SleepOver app.
 * Uses a warm, parent-friendly color scheme designed for readability
 * in various lighting conditions.
 */

export interface Theme {
  bg: string;
  card: string;
  text: string;
  muted: string;
  line: string;
  green: string;
  purpleA: string;
  purpleB: string;
  tealA: string;
  tealB: string;
  yellowA: string;
  yellowB: string;
  iconBgPurple: string;
  iconBgTeal: string;
  iconBgYellow: string;
}

export const THEME: Theme = {
  // Base colors - Kumo Design System v1.0
  bg: "#F7F1EC",          // Warm Cream (background principal)
  card: "#FBF8F6",        // Soft Card White (cards)
  text: "#4B3F39",        // Primary text (remplace le noir)
  muted: "#7A6A60",       // Secondary text
  line: "#EFE7E1",        // Muted Beige (dividers et bordures)
  green: "#2FB56A",       // Success/active color (conservé)

  // Couleurs plates pour actions (plus de gradients)
  // Sleep (couleur à définir - conserve l'ancienne pour l'instant)
  purpleA: "#BCA7E6",     // Sleep color (à remplacer)
  purpleB: "#BCA7E6",     // Même couleur (pas de gradient)

  // Feeding (Soft Sage)
  tealA: "#E6A77D",       // Alimentation/Biberon (couleur unique)
  tealB: "#E6A77D",       // Même couleur (pas de gradient)

  // Diaper (Warm Peach)
  yellowA: "#E3B58F",     // Couches/Hygiène (couleur unique)
  yellowB: "#E3B58F",     // Même couleur (pas de gradient)

  // Icon background colors (à ajuster si besoin)
  iconBgPurple: "#EFE9FA", // Light purple for sleep icons
  iconBgTeal: "#F5E5D8",   // Light peach for feeding icons
  iconBgYellow: "#F5EBE3", // Light warm for diaper icons
};

/**
 * Storage keys for AsyncStorage persistence
 * Version 3 of the data schema
 */
export interface StorageKeys {
  BABY: string;
  SETTINGS: string;
  EVENTS: string;
  CAREGIVER: string;
  REMINDERS: string;
  REMINDER_SETTINGS: string;
}

export const STORAGE_KEYS: StorageKeys = {
  BABY: "bt_baby_v3",
  SETTINGS: "bt_settings_v3",
  EVENTS: "bt_events_v3",
  CAREGIVER: "bt_caregiver_v3",
  REMINDERS: "bt_reminders_v3",
  REMINDER_SETTINGS: "bt_reminder_settings_v3",
};

/**
 * Default application settings
 */
export const DEFAULT_SETTINGS = {
  defaultFeedingAmountMl: 120,  // Default bottle size in milliliters
  defaultDiaperType: "pee",      // Default diaper type: "pee" | "poo" | "mixed"
};

/**
 * Default caregiver profile
 * Created when baby profile is first set up
 */
export const DEFAULT_CAREGIVER = {
  id: null, // Will be generated with makeId()
  name: "Parent",
  role: "parent",
};

/**
 * Default reminder settings
 * Controls notification behavior and scheduling
 */
export const DEFAULT_REMINDER_SETTINGS = {
  pushEnabled: true,          // Enable/disable push notifications
  quietHoursEnabled: true,    // Enable/disable quiet hours
  quietStartHour: 22,         // Quiet hours start (10 PM)
  quietEndHour: 7,            // Quiet hours end (7 AM)
  maxPerDay: 6,               // Maximum reminders per day
  feedingGapEnabled: true,    // Enable minimum gap between feeding reminders
  feedingGapMinutes: 180,     // 3 hours minimum between feeding reminders
};

/**
 * Time constants in milliseconds
 */
export const TIME_CONSTANTS = {
  MINUTE_MS: 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
};

/**
 * Event types
 */
export const EVENT_TYPES = {
  FEEDING: "feeding",
  DIAPER: "diaper",
  SLEEP: "sleep",
};

/**
 * Diaper types
 */
export const DIAPER_TYPES = {
  PEE: "pee",
  POO: "poo",
  MIXED: "mixed",
};

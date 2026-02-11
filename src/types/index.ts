/**
 * TypeScript type definitions for SleepOver app
 * Central location for all data models and interfaces
 */

// ==================== Core Data Models ====================

/**
 * Baby profile information
 */
export interface Baby {
  /** Unique identifier */
  id: string;
  /** Baby's name */
  name: string;
  /** Birth date in ISO 8601 format */
  birthDateISO: string;
  /** Sex - required for WHO growth charts */
  sex: 'male' | 'female';
  /** Avatar emoji (optional) */
  avatar?: string;
  /** Initial weight in kg (captured during onboarding) */
  initialWeight?: number;
  /** Initial height/length in cm (captured during onboarding) */
  initialHeight?: number;
  /** Timestamp when profile was created */
  createdAt: number;
}

/**
 * Event types that can be tracked
 */
export type EventType = 'feeding' | 'diaper' | 'sleep';

/**
 * Diaper change types
 */
export type DiaperType = 'pee' | 'poo' | 'mixed';

/**
 * Event data structure for tracking baby activities
 */
export interface Event {
  /** Unique identifier */
  id: string;
  /** ID of the baby this event belongs to */
  babyId: string;
  /** ID of caregiver who logged the event */
  caregiverId: string | null;
  /** Type of event */
  type: EventType;
  /** Event timestamp (Unix milliseconds) */
  ts: number;
  
  // Feeding-specific fields
  /** Amount of milk/formula in milliliters */
  amountMl?: number | null;
  
  // Diaper-specific fields
  /** Type of diaper change */
  diaperType?: DiaperType | null;
  
  // Sleep-specific fields
  /** Sleep start time (Unix ms) */
  startTs?: number | null;
  /** Sleep end time (Unix ms) - null if ongoing */
  endTs?: number | null;
  
  // Common metadata
  /** Optional note */
  note?: string | null;
  /** Last modification timestamp */
  updatedAt: number;
  /** Soft delete timestamp */
  deletedAt?: number | null;
}

/**
 * Caregiver information
 */
export interface Caregiver {
  /** Unique identifier */
  id: string;
  /** Caregiver's name */
  name: string;
  /** Role (e.g., "parent", "nanny", "grandparent") */
  role: string;
}

/**
 * Application settings
 */
export interface Settings {
  /** Default feeding amount in ml */
  defaultFeedingAmountMl: number;
  /** Default diaper type */
  defaultDiaperType: DiaperType;
}

// ==================== Reminder System ====================

/**
 * Reminder types
 */
export type ReminderKind = 'feeding' | 'diaper';

/**
 * Reminder data structure
 */
export interface Reminder {
  /** Unique identifier */
  id: string;
  /** Type of reminder */
  kind: ReminderKind;
  /** Related event ID (if applicable) */
  eventId?: string;
  /** When reminder was created */
  createdAt: number;
  /** When reminder should fire (Unix ms) */
  fireAtMs: number;
  /** Expo notification ID */
  notifId?: string;
  /** When reminder was fired */
  firedAt?: number;
  /** When reminder was dismissed */
  dismissedAt?: number;
}

/**
 * Reminder configuration settings
 */
export interface ReminderSettings {
  /** Whether push notifications are enabled */
  pushEnabled: boolean;
  /** Whether quiet hours are enabled */
  quietHoursEnabled: boolean;
  /** Quiet hours start (24h format, e.g., 22) */
  quietStartHour: number;
  /** Quiet hours end (24h format, e.g., 7) */
  quietEndHour: number;
  /** Maximum reminders per day */
  maxPerDay: number;
  /** Whether feeding gap reminder is enabled */
  feedingGapEnabled: boolean;
  /** Minutes between feedings before reminder triggers */
  feedingGapMinutes: number;
  /** Default minutes until feeding reminder (deprecated - use feedingGapMinutes) */
  feedingDefaultMinutes?: number;
  /** Default minutes until diaper reminder (deprecated) */
  diaperDefaultMinutes?: number;
}

// ==================== Toast/Undo System ====================

/**
 * Toast message for undo functionality
 */
export interface Toast {
  /** Whether toast is visible */
  visible: boolean;
  /** Toast title text */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** ID of the related event */
  eventId?: string;
  /** Timestamp when toast was created */
  createdAtMs?: number;
  /** Last timestamp where editing is allowed */
  canEditUntilMs?: number;
  /** Legacy toast message text */
  message?: string;
  /** Type of undo action */
  undoKind?: 'delete_event' | 'reopen_sleep' | 'stop_sleep' | 'edit_event';
  /** Event associated with undo action */
  event?: Event;
  /** Previous event state (for edit undo) */
  previousEvent?: Event;
}

// ==================== Screen Props ====================

/**
 * Props for HomeScreen
 */
export interface HomeScreenProps {
  baby: Baby | null;
  caregiver: Caregiver;
  settings: Settings;
  events: Event[];
  reminders: Reminder[];
  reminderSettings: ReminderSettings;
  setEvents: (events: Event[] | ((prev: Event[]) => Event[])) => void;
  requestReminderSheet: (kind: ReminderKind, eventTs: number, eventId: string) => void;
  nowMs: number;
  onOpenEditEvent: (event: Event) => void;
  onShowToastForEvent: (event: Event, toast: Partial<Toast>) => void;
  logDiaper: (diaperType: DiaperType) => void;
  logFeeding: (amountMl: number) => void;
  startSleep: () => void;
  stopSleep: (event: Event) => void;
}

/**
 * Props for HistoryScreen
 */
export interface HistoryScreenProps {
  baby: Baby | null;
  events: Event[];
  onOpenEditEvent: (event: Event) => void;
}

/**
 * Props for StatsScreen
 */
export interface StatsScreenProps {
  baby: Baby | null;
  events: Event[];
  onOpenEditEvent: (event: Event) => void;
}

// ==================== Navigation Types ====================

/**
 * Stack navigator params
 */
export type SettingsStackParamList = {
  SettingsHome: undefined;
  BabyProfile: undefined;
  Notifications: undefined;
  Share: undefined;
  Appearance: undefined;
};

/**
 * Tab navigator params
 */
export type TabsParamList = {
  Home: undefined;
  SleepPlanner: undefined;
  History: undefined;
  Stats: undefined;
  Growth: undefined;
  Milestones: undefined;
  Settings: undefined;
};

/**
 * App State Context Providers
 * Provides global state management using React Context API
 */

import React, { createContext, useContext, ReactNode } from 'react';
import type {
  Baby,
  Caregiver,
  Settings,
  Event,
  Reminder,
  ReminderSettings,
  ReminderKind,
  DiaperType,
  Toast,
} from '../types';

// ==================== Baby Context ====================

interface BabyContextValue {
  baby: Baby | null;
  setBaby: (baby: Baby | null) => void;
  onCreateBaby: (baby: Baby) => Promise<void>;
  onUpdateBaby: (baby: Baby) => void;
}

const BabyContext = createContext<BabyContextValue | undefined>(undefined);

export function useBaby() {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within BabyProvider');
  }
  return context;
}

interface BabyProviderProps {
  children: ReactNode;
  value: BabyContextValue;
}

export function BabyProvider({ children, value }: BabyProviderProps) {
  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
}

// ==================== Caregiver Context ====================

interface CaregiverContextValue {
  caregiver: Caregiver;
  setCaregiver: (caregiver: Caregiver) => void;
}

const CaregiverContext = createContext<CaregiverContextValue | undefined>(undefined);

export function useCaregiver() {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error('useCaregiver must be used within CaregiverProvider');
  }
  return context;
}

interface CaregiverProviderProps {
  children: ReactNode;
  value: CaregiverContextValue;
}

export function CaregiverProvider({ children, value }: CaregiverProviderProps) {
  return <CaregiverContext.Provider value={value}>{children}</CaregiverContext.Provider>;
}

// ==================== Settings Context ====================

interface SettingsContextValue {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
  value: SettingsContextValue;
}

export function SettingsProvider({ children, value }: SettingsProviderProps) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// ==================== Events Context ====================

interface EventsContextValue {
  events: Event[];
  setEvents: (events: Event[] | ((prev: Event[]) => Event[])) => void;
  logFeeding: (amountMl: number) => void;
  logDiaper: (diaperType: DiaperType) => void;
  startSleep: () => void;
  stopSleep: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  onOpenEditEvent: (event: Event) => void;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}

interface EventsProviderProps {
  children: ReactNode;
  value: EventsContextValue;
}

export function EventsProvider({ children, value }: EventsProviderProps) {
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

// ==================== Reminders Context ====================

interface RemindersContextValue {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  reminderSettings: ReminderSettings;
  setReminderSettings: (settings: ReminderSettings | ((prev: ReminderSettings) => ReminderSettings)) => void;
  requestReminderSheet: (kind: ReminderKind, eventTs: number, eventId: string) => void;
  ensurePushPermission: () => Promise<boolean>;
}

const RemindersContext = createContext<RemindersContextValue | undefined>(undefined);

export function useReminders() {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within RemindersProvider');
  }
  return context;
}

interface RemindersProviderProps {
  children: ReactNode;
  value: RemindersContextValue;
}

export function RemindersProvider({ children, value }: RemindersProviderProps) {
  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

// ==================== Toast Context ====================

interface ToastContextValue {
  toast: Toast | null;
  showToastForEvent: (event: Event, params: Partial<Toast>) => void;
  closeToast: () => void;
  undoAction: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  value: ToastContextValue;
}

export function ToastProvider({ children, value }: ToastProviderProps) {
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

// ==================== Combined App Context ====================

/**
 * Combined context value containing all app state
 * This is a convenience interface for components that need multiple contexts
 */
export interface AppContextValue {
  baby: BabyContextValue;
  caregiver: CaregiverContextValue;
  settings: SettingsContextValue;
  events: EventsContextValue;
  reminders: RemindersContextValue;
  toast: ToastContextValue;
  nowMs: number;
}

/**
 * Convenience hook to access all app contexts
 * Use specific hooks (useBaby, useEvents, etc.) when you only need one context
 */
export function useAppContext(): AppContextValue {
  return {
    baby: useBaby(),
    caregiver: useCaregiver(),
    settings: useSettings(),
    events: useEvents(),
    reminders: useReminders(),
    toast: useToast(),
    nowMs: Date.now(),
  };
}

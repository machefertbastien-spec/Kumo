import React from 'react';
import { render } from '@testing-library/react-native';
import {
  BabyProvider,
  EventsProvider,
  SettingsProvider,
  RemindersProvider,
  CaregiverProvider,
  ToastProvider,
} from './contexts';
import type { ReminderSettings, Settings, Toast } from './types';

/**
 * Custom render function that wraps components with all Context providers
 * Use this instead of the default render() for components that need Context
 */
export function renderWithProviders(ui: React.ReactElement, options?: any) {
  const now = Date.now();

  const defaultBaby = {
    id: '1',
    name: 'Test Baby',
    birthDateISO: '2025-12-23',
    avatar: '👶',
    sex: 'female' as const,
    createdAt: now,
  };

  const defaultCaregiver = {
    id: 'caregiver-test',
    name: 'Parent',
    role: 'parent',
  };

  const defaultSettings: Settings = {
    defaultFeedingAmountMl: 120,
    defaultDiaperType: 'pee',
  };

  const defaultReminderSettings: ReminderSettings = {
    pushEnabled: true,
    quietHoursEnabled: true,
    quietStartHour: 22,
    quietEndHour: 7,
    maxPerDay: 6,
    feedingGapEnabled: true,
    feedingGapMinutes: 180,
  };

  const defaultToast: Toast = {
    visible: false,
  };

  return render(
    <BabyProvider
      value={{
        baby: defaultBaby,
        setBaby: jest.fn(),
        onCreateBaby: jest.fn(async () => undefined),
        onUpdateBaby: jest.fn(),
      }}
    >
      <CaregiverProvider value={{ caregiver: defaultCaregiver, setCaregiver: jest.fn() }}>
        <EventsProvider
          value={{
            events: [],
            setEvents: jest.fn(),
            logFeeding: jest.fn(),
            logDiaper: jest.fn(),
            startSleep: jest.fn(),
            stopSleep: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
            onOpenEditEvent: jest.fn(),
          }}
        >
          <SettingsProvider value={{ settings: defaultSettings, setSettings: jest.fn() }}>
            <RemindersProvider
              value={{
                reminderSettings: defaultReminderSettings,
                setReminderSettings: jest.fn(),
                reminders: [],
                setReminders: jest.fn(),
                requestReminderSheet: jest.fn(),
                ensurePushPermission: jest.fn(async () => true),
              }}
            >
              <ToastProvider
                value={{
                  toast: defaultToast,
                  showToastForEvent: jest.fn(),
                  closeToast: jest.fn(),
                  undoAction: jest.fn(),
                }}
              >
                {ui}
              </ToastProvider>
            </RemindersProvider>
          </SettingsProvider>
        </EventsProvider>
      </CaregiverProvider>
    </BabyProvider>,
    options
  );
}

// Re-export everything from @testing-library/react-native
export * from '@testing-library/react-native';

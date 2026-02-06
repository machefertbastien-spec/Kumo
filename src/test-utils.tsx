import React from 'react';
import { render } from '@testing-library/react-native';
import { 
  BabyProvider, 
  EventsProvider, 
  SettingsProvider, 
  RemindersProvider,
  CaregiverProvider,
  ToastProvider
} from './contexts';

/**
 * Custom render function that wraps components with all Context providers
 * Use this instead of the default render() for components that need Context
 */
export function renderWithProviders(ui: React.ReactElement, options?: any) {
  // Default test values
  const defaultBaby = {
    id: '1',
    name: 'Test Baby',
    birthDateISO: '2025-12-23',
    avatar: '👶',
    sex: 'female' as const,
  };

  const defaultCaregiver = {
    name: 'Parent',
  };

  const defaultSettings = {
    theme: 'light' as const,
  };

  return render(
    <BabyProvider value={{ baby: defaultBaby, setBaby: jest.fn(), onUpdateBaby: jest.fn() }}>
      <CaregiverProvider value={{ caregiver: defaultCaregiver, setCaregiver: jest.fn() }}>
        <EventsProvider value={{ events: [], setEvents: jest.fn(), addEvent: jest.fn(), updateEvent: jest.fn(), deleteEvent: jest.fn() }}>
          <SettingsProvider value={{ settings: defaultSettings, setSettings: jest.fn() }}>
            <RemindersProvider value={{ reminderSettings: {}, setReminderSettings: jest.fn(), reminders: [], setReminders: jest.fn(), scheduleReminder: jest.fn(), cancelReminder: jest.fn() }}>
              <ToastProvider value={{ toasts: [], addToast: jest.fn(), removeToast: jest.fn() }}>
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

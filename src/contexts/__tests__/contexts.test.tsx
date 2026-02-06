import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BabyProvider, useBaby } from '../index';
import { renderHook, act } from '@testing-library/react-native';
import type { Baby } from '../../types';

// Test component to access context
function TestComponent() {
  const { baby, onUpdateBaby } = useBaby();
  return null;
}

describe('BabyProvider', () => {
  it('provides default null baby', () => {
    let babyState: Baby | null = null;
    const setBaby = jest.fn((b) => { babyState = b; });
    const onCreateBaby = jest.fn();
    const onUpdateBaby = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BabyProvider value={{ baby: babyState, setBaby, onCreateBaby, onUpdateBaby }}>
        {children}
      </BabyProvider>
    );

    const { result } = renderHook(() => useBaby(), { wrapper });

    expect(result.current.baby).toBeNull();
  });

  it('updates baby data', () => {
    let babyState: Baby | null = null;
    const setBaby = jest.fn();
    const onCreateBaby = jest.fn();
    const onUpdateBaby = jest.fn((b) => { babyState = b; });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BabyProvider value={{ baby: babyState, setBaby, onCreateBaby, onUpdateBaby }}>
        {children}
      </BabyProvider>
    );

    const { result, rerender } = renderHook(() => useBaby(), { wrapper });

    const newBaby = {
      id: '1',
      name: 'Emma',
      birthDateISO: '2025-12-23',
      avatar: '👶',
      sex: 'female' as const,
      createdAt: Date.now(),
    };

    act(() => {
      result.current.onUpdateBaby(newBaby);
      babyState = newBaby;
    });

    rerender(wrapper);

    expect(onUpdateBaby).toHaveBeenCalledWith(newBaby);
  });

  it('resets baby data', () => {
    const newBaby = {
      id: '1',
      name: 'Emma',
      birthDateISO: '2025-12-23',
      avatar: '👶',
      sex: 'female' as const,
      createdAt: Date.now(),
    };

    let babyState: Baby | null = newBaby;
    const setBaby = jest.fn();
    const onCreateBaby = jest.fn();
    const onUpdateBaby = jest.fn((b) => { babyState = b; });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BabyProvider value={{ baby: babyState, setBaby, onCreateBaby, onUpdateBaby }}>
        {children}
      </BabyProvider>
    );

    const { result, rerender } = renderHook(() => useBaby(), { wrapper });

    expect(result.current.baby).toEqual(newBaby);

    act(() => {
      result.current.onUpdateBaby(null as any);
      babyState = null;
    });

    rerender(wrapper);

    expect(onUpdateBaby).toHaveBeenCalled();
  });
});

describe('EventsProvider', () => {
  it('provides empty events array by default', () => {
    const EventsProvider = require('../index').EventsProvider;
    const useEvents = require('../index').useEvents;
    
    let eventsState: any[] = [];
    const setEvents = jest.fn();
    const logFeeding = jest.fn();
    const logDiaper = jest.fn();
    const startSleep = jest.fn();
    const stopSleep = jest.fn();
    const updateEvent = jest.fn();
    const deleteEvent = jest.fn();
    const onOpenEditEvent = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventsProvider value={{ events: eventsState, setEvents, logFeeding, logDiaper, startSleep, stopSleep, updateEvent, deleteEvent, onOpenEditEvent }}>
        {children}
      </EventsProvider>
    );

    const { result } = renderHook(() => useEvents(), { wrapper });

    expect(result.current.events).toEqual([]);
  });

  it('adds new event', () => {
    const EventsProvider = require('../../contexts').EventsProvider;
    const useEvents = require('../../contexts').useEvents;
    
    let eventsState: any[] = [];
    const setEvents = jest.fn((updater: any) => {
      eventsState = typeof updater === 'function' ? updater(eventsState) : updater;
    });
    const logFeeding = jest.fn();
    const logDiaper = jest.fn();
    const startSleep = jest.fn();
    const stopSleep = jest.fn();
    const updateEvent = jest.fn();
    const deleteEvent = jest.fn();
    const onOpenEditEvent = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventsProvider value={{ events: eventsState, setEvents, logFeeding, logDiaper, startSleep, stopSleep, updateEvent, deleteEvent, onOpenEditEvent }}>
        {children}
      </EventsProvider>
    );

    const { result, rerender } = renderHook(() => useEvents(), { wrapper });

    act(() => {
      // Simulate adding event via setEvents
      result.current.setEvents([{ id: '1', type: 'feeding', ts: Date.now() }]);
    });

    rerender(wrapper);

    expect(setEvents).toHaveBeenCalled();
  });

  it('deletes event', () => {
    const EventsProvider = require('../../contexts').EventsProvider;
    const useEvents = require('../../contexts').useEvents;
    
    const newEvent = {
      id: '1',
      type: 'feeding' as const,
      ts: Date.now(),
      amountMl: 120,
    };

    let eventsState: any[] = [newEvent];
    const setEvents = jest.fn();
    const logFeeding = jest.fn();
    const logDiaper = jest.fn();
    const startSleep = jest.fn();
    const stopSleep = jest.fn();
    const updateEvent = jest.fn();
    const deleteEvent = jest.fn();
    const onOpenEditEvent = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventsProvider value={{ events: eventsState, setEvents, logFeeding, logDiaper, startSleep, stopSleep, updateEvent, deleteEvent, onOpenEditEvent }}>
        {children}
      </EventsProvider>
    );

    const { result, rerender } = renderHook(() => useEvents(), { wrapper });

    expect(result.current.events).toHaveLength(1);

    act(() => {
      result.current.deleteEvent('1');
    });

    rerender(wrapper);

    expect(deleteEvent).toHaveBeenCalledWith('1');
  });

  it('updates event', () => {
    const EventsProvider = require('../../contexts').EventsProvider;
    const useEvents = require('../../contexts').useEvents;
    
    const newEvent = {
      id: '1',
      type: 'feeding' as const,
      ts: Date.now(),
      amountMl: 120,
    };

    let eventsState: any[] = [newEvent];
    const setEvents = jest.fn();
    const logFeeding = jest.fn();
    const logDiaper = jest.fn();
    const startSleep = jest.fn();
    const stopSleep = jest.fn();
    const updateEvent = jest.fn();
    const deleteEvent = jest.fn();
    const onOpenEditEvent = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventsProvider value={{ events: eventsState, setEvents, logFeeding, logDiaper, startSleep, stopSleep, updateEvent, deleteEvent, onOpenEditEvent }}>
        {children}
      </EventsProvider>
    );

    const { result, rerender } = renderHook(() => useEvents(), { wrapper });

    const updatedEvent = {
      ...newEvent,
      amountMl: 150,
    };

    act(() => {
      result.current.updateEvent(updatedEvent);
    });

    rerender(wrapper);

    expect(updateEvent).toHaveBeenCalledWith(updatedEvent);
  });
});

describe('SettingsProvider', () => {
  it('provides default settings', () => {
    const SettingsProvider = require('../index').SettingsProvider;
    const useSettings = require('../index').useSettings;
    
    const defaultSettings = {
      theme: 'light',
      language: 'en',
    };
    
    const setSettings = jest.fn();
    const onUpdateSettings = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SettingsProvider value={{ settings: defaultSettings, setSettings, onUpdateSettings }}>
        {children}
      </SettingsProvider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings).toBeDefined();
    expect(result.current.settings.theme).toBeDefined();
  });

  it('updates settings', () => {
    const SettingsProvider = require('../../contexts').SettingsProvider;
    const useSettings = require('../../contexts').useSettings;
    
    let settingsState = {
      theme: 'light',
      language: 'en',
    };
    
    const setSettings = jest.fn();
    const onUpdateSettings = jest.fn((s) => { settingsState = s; });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SettingsProvider value={{ settings: settingsState, setSettings, onUpdateSettings }}>
        {children}
      </SettingsProvider>
    );

    const { result, rerender } = renderHook(() => useSettings(), { wrapper });

    const newSettings = {
      ...result.current.settings,
      theme: 'dark',
    };

    act(() => {
      result.current.onUpdateSettings(newSettings);
    });

    rerender(wrapper);

    expect(onUpdateSettings).toHaveBeenCalledWith(newSettings);
  });
});

describe('RemindersProvider', () => {
  it('provides empty reminders array by default', () => {
    const RemindersProvider = require('../index').RemindersProvider;
    const useReminders = require('../index').useReminders;
    
    let remindersState: any[] = [];
    const setReminders = jest.fn();
    const onScheduleReminder = jest.fn();
    const onCancelReminder = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RemindersProvider value={{ reminders: remindersState, setReminders, onScheduleReminder, onCancelReminder }}>
        {children}
      </RemindersProvider>
    );

    const { result } = renderHook(() => useReminders(), { wrapper });

    expect(result.current.reminders).toEqual([]);
  });

  it('schedules reminder', () => {
    const RemindersProvider = require('../../contexts').RemindersProvider;
    const useReminders = require('../../contexts').useReminders;
    
    let remindersState: any[] = [];
    const setReminders = jest.fn();
    const onScheduleReminder = jest.fn((r) => { remindersState = [...remindersState, r]; });
    const onCancelReminder = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RemindersProvider value={{ reminders: remindersState, setReminders, onScheduleReminder, onCancelReminder }}>
        {children}
      </RemindersProvider>
    );

    const { result, rerender } = renderHook(() => useReminders(), { wrapper });

    const newReminder = {
      id: '1',
      type: 'feeding' as const,
      triggerAtMs: Date.now() + 1000,
      enabled: true,
    };

    act(() => {
      result.current.onScheduleReminder(newReminder);
    });

    rerender(wrapper);

    expect(onScheduleReminder).toHaveBeenCalledWith(newReminder);
  });

  it('cancels reminder', () => {
    const RemindersProvider = require('../../contexts').RemindersProvider;
    const useReminders = require('../../contexts').useReminders;
    
    const newReminder = {
      id: '1',
      type: 'feeding' as const,
      triggerAtMs: Date.now() + 1000,
      enabled: true,
    };

    let remindersState: any[] = [newReminder];
    const setReminders = jest.fn();
    const onScheduleReminder = jest.fn();
    const onCancelReminder = jest.fn((id) => { remindersState = remindersState.filter(r => r.id !== id); });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RemindersProvider value={{ reminders: remindersState, setReminders, onScheduleReminder, onCancelReminder }}>
        {children}
      </RemindersProvider>
    );

    const { result, rerender } = renderHook(() => useReminders(), { wrapper });

    expect(result.current.reminders).toHaveLength(1);

    act(() => {
      result.current.onCancelReminder('1');
    });

    rerender(wrapper);

    expect(onCancelReminder).toHaveBeenCalledWith('1');
  });
});

# SleepOver - Refactoring Guide

## Overview

This guide explains how to migrate from the single-file `App.js` (2590 lines) to the new modular structure. The refactoring is designed to be done incrementally, so you can migrate piece by piece while keeping the app functional.

## Current Status

✅ **Completed:**
- Created new folder structure (`src/`)
- Extracted constants into `src/constants/theme.js`
- Extracted utilities into `src/utils/`
- Extracted UI components into `src/components/`
- Added comprehensive JSDoc documentation
- Created architecture documentation

⚠️ **Still in Original App.js:**
- Screen components (HomeScreen, HistoryScreen, StatsScreen, etc.)
- Modal components (ReminderSheet, EditEventSheet)
- Main App component with state management
- Navigation setup

## New Project Structure

```
SleepOver/
├── src/
│   ├── components/          ✅ DONE
│   │   ├── index.js         # Exports all components
│   │   ├── Card.js
│   │   ├── Chip.js
│   │   ├── Divider.js
│   │   ├── GradientTile.js
│   │   ├── MiniMetric.js
│   │   ├── EmptyState.js
│   │   ├── EventRow.js
│   │   ├── Stepper.js
│   │   ├── BottomSheet.js
│   │   └── ActionToast.js
│   │
│   ├── constants/           ✅ DONE
│   │   ├── index.js
│   │   └── theme.js         # Colors, storage keys, defaults
│   │
│   ├── utils/               ✅ DONE
│   │   ├── index.js
│   │   ├── dateUtils.js     # Date formatting, time calculations
│   │   ├── eventUtils.js    # Event helpers, filtering, formatting
│   │   └── storageUtils.js  # AsyncStorage helpers
│   │
│   ├── screens/             🚧 TODO
│   │   ├── HomeScreen.js
│   │   ├── HistoryScreen.js
│   │   ├── StatsScreen.js
│   │   ├── OnboardingScreen.js
│   │   └── settings/
│   │       ├── SettingsHomeScreen.js
│   │       ├── BabyProfileScreen.js
│   │       ├── NotificationsScreen.js
│   │       ├── ShareScreen.js
│   │       └── AppearanceScreen.js
│   │
│   ├── hooks/               🚧 TODO
│   │   ├── useReminders.js
│   │   └── useEvents.js
│   │
│   └── navigation/          🚧 TODO
│       └── AppNavigator.js
│
├── App.js                   # Will become simpler root component
├── package.json
└── README.md                ✅ UPDATED
```

## Migration Steps

### Phase 1: Use Extracted Modules (Current Phase)

You can start using the extracted modules immediately in your existing `App.js`:

```javascript
// At the top of App.js, replace inline definitions with imports:

// Instead of defining THEME inline, import it:
import { THEME, STORAGE_KEYS, DEFAULT_SETTINGS } from './src/constants';

// Instead of defining utility functions inline, import them:
import { 
  makeId, 
  agoShort, 
  babyAgeLabel,
  isInQuietHours,
  nextAllowedTimeMs 
} from './src/utils';

// Instead of defining components inline, import them:
import {
  Card,
  Chip,
  Divider,
  GradientTile,
  MiniMetric,
  EmptyState,
  EventRow,
  Stepper,
  BottomSheet,
  ActionToast
} from './src/components';
```

**Benefits:**
- Reduces App.js line count immediately
- Makes code more testable
- No functional changes needed
- Can be done incrementally

### Phase 2: Extract Screens (Recommended Next)

Each screen component can be moved to its own file:

#### Example: Extract HomeScreen

1. **Create** `src/screens/HomeScreen.js`:

```javascript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, GradientTile, MiniMetric } from '../components';
import { THEME } from '../constants';

export function HomeScreen({ 
  baby, 
  events, 
  settings,
  nowMs,
  onShowToastForEvent,
  requestReminderSheet,
  // ... other props
}) {
  // Move the entire HomeScreen function body here
  
  return (
    // ... existing JSX
  );
}
```

2. **In App.js**, replace the inline function:

```javascript
// Before:
function HomeScreen({ baby, events, ... }) {
  // 200 lines of code
}

// After:
import { HomeScreen } from './src/screens/HomeScreen';
```

3. **Repeat for all screens:**
- `HomeScreen.js` (~200 lines)
- `HistoryScreen.js` (~126 lines)
- `StatsScreen.js` (~197 lines)
- `OnboardingScreen.js` (~110 lines)
- Settings screens (~100 lines each)

### Phase 3: Extract Modal Components

Move modal/sheet components to separate files:

```
src/components/modals/
├── ReminderSheet.js
└── EditEventSheet.js
```

### Phase 4: Extract Custom Hooks (Advanced)

Create custom hooks for complex logic:

#### Example: useReminders Hook

```javascript
// src/hooks/useReminders.js
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export function useReminders(initialReminders, reminderSettings) {
  const [reminders, setReminders] = useState(initialReminders);
  
  // Move all reminder-related logic here:
  // - scheduleReminder
  // - tickReminders
  // - dismissReminder
  // etc.
  
  return {
    reminders,
    scheduleReminder,
    dismissReminder,
    // ... other functions
  };
}
```

#### Example: useEvents Hook

```javascript
// src/hooks/useEvents.js
import { useState } from 'react';
import { makeId } from '../utils';

export function useEvents(initialEvents) {
  const [events, setEvents] = useState(initialEvents);
  
  const addEvent = (eventData) => {
    const newEvent = {
      id: makeId(),
      ts: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...eventData,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };
  
  const updateEvent = (id, updates) => {
    setEvents(prev => 
      prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e)
    );
  };
  
  const deleteEvent = (id) => {
    const ts = Date.now();
    setEvents(prev => 
      prev.map(e => e.id === id ? { ...e, deletedAt: ts, updatedAt: ts } : e)
    );
  };
  
  return { events, addEvent, updateEvent, deleteEvent };
}
```

### Phase 5: Simplify App.js

After extracting everything, `App.js` becomes a clean orchestrator:

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppState } from './src/hooks/useAppState';

export default function App() {
  const { 
    hydrated,
    baby,
    events,
    reminders,
    // ... all state
  } = useAppState();

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator 
        baby={baby}
        events={events}
        reminders={reminders}
        // ... pass props
      />
    </NavigationContainer>
  );
}
```

## Quick Start: Immediate Improvements

You can improve code quality immediately without moving files:

### 1. Add Imports to Existing App.js

At the top of `App.js`, add:

```javascript
// Replace inline theme with import
import { 
  THEME, 
  STORAGE_KEYS, 
  DEFAULT_SETTINGS,
  DEFAULT_CAREGIVER,
  DEFAULT_REMINDER_SETTINGS,
  TIME_CONSTANTS 
} from './src/constants';

// Replace inline utilities
import {
  makeId,
  round1,
  msToHours,
  agoShort,
  babyAgeLabel,
  isInQuietHours,
  nextAllowedTimeMs,
  diaperLabel,
  eventTitle,
  eventIcon,
  calcSleepTotalBetween,
  loadJson,
  saveJson,
  safeParseJson
} from './src/utils';

// Replace inline components
import {
  Card,
  Divider,
  GradientTile,
  MiniMetric,
  EmptyState,
  EventRow,
  Chip,
  Stepper,
  BottomSheet,
  ActionToast
} from './src/components';
```

### 2. Remove Duplicate Code

Delete the following from `App.js` (they're now imported):

- ❌ `const THEME = { ... }`
- ❌ `const K_BABY = ...`
- ❌ `const DEFAULT_SETTINGS = { ... }`
- ❌ `function makeId() { ... }`
- ❌ `function agoShort() { ... }`
- ❌ `function Card({ ... }) { ... }`
- ❌ etc. (all exported functions/constants)

This alone will reduce `App.js` from 2590 lines to ~2000 lines!

## Testing Your Refactoring

After each change, test that:

1. ✅ App still runs without errors
2. ✅ All features work (add events, view history, etc.)
3. ✅ Data persists correctly
4. ✅ Notifications work
5. ✅ Export/import works

## Benefits of This Refactoring

### Immediate Benefits:
- ✅ **Better Organization**: Easy to find specific code
- ✅ **Documented Code**: JSDoc comments on all functions
- ✅ **Reusability**: Components can be used elsewhere
- ✅ **Testability**: Utilities can be unit tested
- ✅ **Maintainability**: Smaller files are easier to understand

### Future Benefits:
- 🚀 **Team Collaboration**: Multiple people can work on different files
- 🚀 **Code Splitting**: Better performance with lazy loading
- 🚀 **Testing**: Easier to write unit tests for utilities
- 🚀 **TypeScript**: Easier to add types incrementally
- 🚀 **Debugging**: Clearer stack traces with named files

## Common Pitfalls to Avoid

### ❌ Don't Change Logic While Refactoring

```javascript
// ❌ BAD: Changing logic during refactor
export function agoShort(fromMs, nowMs) {
  // Let's also add seconds...  <-- DON'T DO THIS
}

// ✅ GOOD: Move code as-is, refactor later
export function agoShort(fromMs, nowMs) {
  // Exact copy of original function
}
```

### ❌ Don't Break Existing Imports

```javascript
// If other files import from App.js, keep exports:
// App.js
export { THEME, makeId }; // Keep for backward compatibility
```

### ❌ Don't Forget to Update Storage Keys

The storage keys use `const K_BABY`, but in new code use `STORAGE_KEYS.BABY`:

```javascript
// Old:
await AsyncStorage.getItem(K_BABY);

// New:
await AsyncStorage.getItem(STORAGE_KEYS.BABY);
```

## Next Steps

1. **Start Small**: Begin by importing the extracted modules into App.js
2. **Remove Duplicates**: Delete the inline definitions
3. **Test Thoroughly**: Ensure everything still works
4. **Extract Screens**: Move one screen at a time
5. **Repeat**: Continue until App.js is clean

## Need Help?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [README.md](./README.md) for features and usage
- Each extracted file has JSDoc comments explaining its purpose

## Checklist

### Immediate (Can do now):
- [ ] Import extracted constants in App.js
- [ ] Import extracted utils in App.js
- [ ] Import extracted components in App.js
- [ ] Remove duplicate code
- [ ] Test app functionality

### Phase 2 (When ready):
- [ ] Extract HomeScreen
- [ ] Extract HistoryScreen
- [ ] Extract StatsScreen
- [ ] Extract OnboardingScreen
- [ ] Extract Settings screens

### Phase 3 (Advanced):
- [ ] Create custom hooks
- [ ] Extract navigation setup
- [ ] Add TypeScript types
- [ ] Add unit tests
- [ ] Add integration tests

---

**Remember**: The goal is not to refactor everything at once, but to improve incrementally while keeping the app functional! 🚀

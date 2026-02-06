# Kumo - Architecture Documentation

## Overview

Kumo is a single-page React Native application that helps parents track their baby's daily activities. The app follows a simple client-side architecture with local data persistence.

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     App Launch                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Load Data from AsyncStorage                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Baby Profile (bt_baby_v3)                          │  │
│  │ • Settings (bt_settings_v3)                          │  │
│  │ • Events (bt_events_v3)                              │  │
│  │ • Caregiver (bt_caregiver_v3)                        │  │
│  │ • Reminders (bt_reminders_v3)                        │  │
│  │ • Reminder Settings (bt_reminder_settings_v3)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
         ┌────────┴──────────┐
         │                   │
         ▼                   ▼
    No Baby?            Baby Exists
         │                   │
         ▼                   ▼
  ┏━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━┓
  ┃  Onboarding   ┃   ┃  Main Tabs    ┃
  ┃    Screen     ┃   ┃    Screen     ┃
  ┗━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━┛
         │                   │
         │                   ▼
         │          ┌────────────────────┐
         │          │  • Home Tab        │
         │          │  • History Tab     │
         │          │  • Stats Tab       │
         │          │  • Settings Stack  │
         │          └────────────────────┘
         │                   │
         └───────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  Continuous Data Sync     │
         │  to AsyncStorage          │
         └───────────────────────────┘
```

## Data Architecture

### State Management

The app uses React hooks for state management with no external state library:

```javascript
// Core Application State (in App component)
const [baby, setBaby] = useState(null)           // Baby profile
const [settings, setSettings] = useState({})     // App settings
const [events, setEvents] = useState([])         // All tracked events
const [caregiver, setCaregiver] = useState({})   // Current caregiver
const [reminders, setReminders] = useState([])   // Scheduled reminders
const [reminderSettings, setReminderSettings] = useState({}) // Reminder config

// UI State
const [nowMs, setNowMs] = useState(Date.now())   // Current time (updates every second)
const [sheetVisible, setSheetVisible] = useState(false) // Reminder sheet visibility
const [toast, setToast] = useState(null)         // Toast notification state
```

### Data Persistence

All state is persisted to AsyncStorage using JSON serialization:

```javascript
// Load pattern
const data = await AsyncStorage.getItem(KEY)
const parsed = data ? JSON.parse(data) : DEFAULT_VALUE

// Save pattern
await AsyncStorage.setItem(KEY, JSON.stringify(value))
```

**Save Triggers:**
- Baby profile: On creation and updates
- Settings: When modified via settings screens
- Events: After every create/update/delete operation
- Reminders: When scheduled, fired, or dismissed
- Reminder Settings: When notification preferences change

### Data Models

#### Baby
```typescript
interface Baby {
  id: string              // Unique identifier
  name: string            // Baby's name
  birthDate: string       // ISO 8601 date string
  createdAt: number       // Unix timestamp
}
```

#### Event
```typescript
interface Event {
  id: string              // Unique identifier
  type: 'feeding' | 'diaper' | 'sleep'
  ts: number              // Event timestamp (Unix ms)
  caregiverId: string     // Who logged the event
  
  // Feeding fields
  amountMl?: number       // Amount in milliliters
  
  // Diaper fields
  diaperType?: 'pee' | 'poo' | 'mixed'
  
  // Sleep fields
  startTs?: number        // Sleep start time (for ongoing sleep)
  endTs?: number          // Sleep end time (when completed)
  
  // Metadata
  createdAt: number       // When event was created
  updatedAt: number       // Last modification time
  deletedAt?: number      // Soft delete timestamp
}
```

#### Reminder
```typescript
interface Reminder {
  id: string              // Unique identifier
  kind: 'feeding' | 'diaper'
  createdAt: number       // Creation timestamp
  fireAtMs: number        // When to trigger
  notifId?: string        // Expo notification ID
  firedAt?: number        // When it actually fired
  dismissedAt?: number    // When user dismissed it
}
```

## Component Architecture

### Component Hierarchy

```
App (Root)
├── NavigationContainer
│   └── RootStack.Navigator
│       ├── OnboardingScreen (if no baby)
│       │   └── Creates baby profile
│       │
│       └── TabsScreen (if baby exists)
│           ├── BottomTabNavigator
│           │   ├── HomeScreen
│           │   │   ├── Quick action buttons
│           │   │   ├── Last event indicators
│           │   │   └── Today's summary
│           │   │
│           │   ├── HistoryScreen
│           │   │   ├── Date filter chips
│           │   │   └── EventRow list
│           │   │
│           │   ├── StatsScreen
│           │   │   ├── Today metrics
│           │   │   └── 7-day chart
│           │   │
│           │   └── SettingsStack.Navigator
│           │       ├── SettingsHomeScreen
│           │       ├── BabyProfileScreen
│           │       ├── NotificationsScreen
│           │       ├── ShareScreen
│           │       └── AppearanceScreen
│           │
│           ├── ReminderSheet (Modal)
│           ├── EditEventSheet (Modal)
│           └── ActionToast (Overlay)
```

### Reusable Components

#### UI Building Blocks
- **Card**: Elevated white container with shadows
- **Divider**: Horizontal line separator
- **Chip**: Pill-shaped selectable button
- **Stepper**: Increment/decrement control

#### Composite Components
- **GradientTile**: Large action button with gradient background
- **MiniMetric**: Icon + value + label stat display
- **EventRow**: Event list item with icon and details
- **EmptyState**: "No events" placeholder

#### Modal Components
- **BottomSheet**: Slide-up modal container
- **ActionToast**: Floating action notification with undo/edit
- **ReminderSheet**: Reminder time picker modal
- **EditEventSheet**: Event editor modal

## Feature Modules

### 1. Event Tracking

**Responsibilities:**
- Create new events (feeding, sleep, diaper)
- Track ongoing sleep sessions
- Show last event time
- Quick action shortcuts

**Key Functions:**
- `logFeeding(amountMl)`: Records feeding event
- `logDiaper(type)`: Records diaper change
- `toggleSleep()`: Start or stop sleep tracking
- `saveEvent(event)`: Persists event to storage

### 2. Statistics & Analytics

**Responsibilities:**
- Calculate daily totals
- Show 7-day trends
- Display sleep duration charts
- Compute averages

**Key Functions:**
- `calcSleepTotalBetween(events, startMs, endMs)`: Total sleep in range
- `countEventsInDay(events, date, type)`: Count by type
- `babyAgeLabel(birthISO)`: Calculate baby's age

### 3. Reminder System

**Responsibilities:**
- Schedule push notifications
- Respect quiet hours
- Enforce daily limits
- Auto-dismiss old reminders

**Key Functions:**
- `scheduleReminder(kind, fireAtMs)`: Schedule notification
- `isInQuietHours(date, start, end)`: Check if in quiet period
- `nextAllowedTimeMs(fireAtMs, start, end)`: Adjust for quiet hours
- `tickReminders()`: Process pending reminders

**Logic Flow:**
```
User requests reminder
      │
      ▼
Check if max/day exceeded? ──YES──> Show alert, abort
      │ NO
      ▼
Calculate fire time
      │
      ▼
Is in quiet hours? ──YES──> Adjust to end of quiet hours
      │ NO
      ▼
Schedule Expo notification
      │
      ▼
Save reminder to state
      │
      ▼
Persist to AsyncStorage
```

### 4. Data Export/Import

**Responsibilities:**
- Export all data as JSON
- Import and merge data
- Share via clipboard or apps
- Validate imported data

**Key Functions:**
- `exportData()`: Serialize all app data
- `importData(json)`: Parse and merge imported data
- `validateImport(data)`: Check data integrity

**Export Format:**
```json
{
  "version": 1,
  "exportedAt": 1234567890,
  "baby": { ... },
  "settings": { ... },
  "caregiver": { ... },
  "events": [ ... ],
  "reminders": [ ... ],
  "reminderSettings": { ... }
}
```

## Navigation Structure

### Navigation Stack

```
RootStack (Native Stack)
├── Onboarding
│   └── Single screen for baby setup
│
└── Tabs (Bottom Tab Navigator)
    ├── Accueil (Home)
    ├── Historique (History)
    ├── Stats (Statistics)
    └── Réglages (Settings Stack)
        ├── SettingsHome
        ├── BabyProfile
        ├── Notifications
        ├── Share
        └── Appearance
```

### Navigation Props Flow

```javascript
// From App to Screens
TabsScreen receives:
  - baby, caregiver, settings, events
  - reminders, reminderSettings
  - State setters
  - Callback functions (onUpdateBaby, onImport, etc.)
  
// From TabsScreen to individual tabs
HomeScreen receives:
  - All data props
  - onShowToastForEvent callback
  - requestReminderSheet callback
  
SettingsStack receives:
  - All data props
  - Navigation prop
  - Update callbacks
```

## Performance Considerations

### Optimization Strategies

1. **Event Filtering**: 
   - Filter events by date before rendering
   - Use `useMemo` for expensive calculations
   - Soft delete instead of array filtering

2. **Render Optimization**:
   - Pass specific props instead of entire state
   - Use `React.memo` for list items
   - Avoid inline functions in render

3. **Storage Optimization**:
   - Batch AsyncStorage writes
   - Save only on meaningful changes
   - Compress old events periodically

4. **Timer Management**:
   - Single 1-second interval for clock
   - Cleanup intervals on unmount
   - Use refs to avoid stale closures

### Current Bottlenecks

⚠️ **Known Issues:**
- No pagination for event history
- Full events array filtered on every render
- No background worker for reminder cleanup
- Large export files for long-term users

## Security & Privacy

### Data Storage
- **All data stored locally**: No external servers
- **AsyncStorage encryption**: Relies on OS-level security
- **No analytics**: No tracking or telemetry
- **Export control**: User manages data sharing

### Permissions Required
- **Notifications**: For reminder alerts (optional)
- **Clipboard**: For export/import (when used)

## Error Handling

### Current Strategy
- Try-catch around AsyncStorage operations
- Fallback to defaults on load failure
- Alert dialogs for user-facing errors
- Console logs for debugging

### Error Scenarios
1. **Storage Full**: AsyncStorage write fails → Alert user
2. **Invalid Import**: JSON parse error → Show validation error
3. **Notification Permission**: Denied → Disable reminder features
4. **Date Parsing**: Invalid date → Use current time as fallback

## Testing Strategy (Planned)

### Unit Tests
- Utility functions (date calculations, formatters)
- Data transformation logic
- Reminder scheduling algorithm

### Integration Tests
- AsyncStorage persistence
- Navigation flows
- Event CRUD operations

### E2E Tests
- Complete user journeys
- Onboarding flow
- Export/import cycle

## Future Architecture Improvements

### Short-term
1. **Code Splitting**: Extract into separate files
2. **Context API**: Replace prop drilling
3. **Custom Hooks**: Extract reusable logic
4. **TypeScript**: Add type safety

### Long-term
1. **State Management**: Consider Redux or Zustand
2. **Backend Sync**: Optional cloud backup
3. **Offline Queue**: Sync when online
4. **Code Push**: Over-the-air updates
5. **Analytics**: Opt-in usage tracking
6. **Multi-device**: Sync across devices

## Development Workflow

### File Organization (Planned)
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── events/          # Event-related components
│   └── stats/           # Statistics components
├── screens/
│   ├── HomeScreen.js
│   ├── HistoryScreen.js
│   ├── StatsScreen.js
│   └── settings/
├── utils/
│   ├── dateUtils.js     # Date formatting and calculations
│   ├── storageUtils.js  # AsyncStorage helpers
│   └── eventUtils.js    # Event manipulation
├── hooks/
│   ├── useReminders.js  # Reminder logic
│   └── useEvents.js     # Event management
├── constants/
│   ├── theme.js         # Colors and styles
│   └── storage.js       # Storage keys
└── types/               # TypeScript definitions
```

### Build Process
1. Development: `npm start` → Expo Dev Client
2. Testing: Manual testing on physical devices
3. Production: `expo build` → App Store submission

---

**Last Updated**: January 21, 2026  
**Version**: 1.0 (Pre-refactor)

# 📚 Kumo API Documentation

Complete API reference for all utility functions, contexts, and components in Kumo.

## Table of Contents

1. [Utility Functions](#utility-functions)
   - [Date Utilities](#date-utilities)
   - [Event Utilities](#event-utilities)
   - [Storage Utilities](#storage-utilities)
   - [Sleep Planner Algorithm](#sleep-planner-algorithm)
2. [Context API](#context-api)
3. [Component API](#component-api)
4. [Type Definitions](#type-definitions)

---

## Utility Functions

### Date Utilities

Located in: `src/utils/dateUtils.ts`

#### `makeId()`

Generate a unique identifier using timestamp and random string.

```typescript
function makeId(): string
```

**Returns:** Unique identifier string  
**Example:**
```typescript
const id = makeId(); // "1706172345678_a4d3f2b1"
```

---

#### `round1(x)`

Round a number to 1 decimal place.

```typescript
function round1(x: number): number
```

**Parameters:**
- `x` - Number to round

**Returns:** Rounded number  
**Example:**
```typescript
round1(12.456); // 12.5
round1(10.04);  // 10.0
```

---

#### `msToHours(ms)`

Convert milliseconds to hours (decimal).

```typescript
function msToHours(ms: number): number
```

**Parameters:**
- `ms` - Milliseconds

**Returns:** Hours as decimal  
**Example:**
```typescript
msToHours(3600000);  // 1.0
msToHours(5400000);  // 1.5
```

---

#### `agoShort(fromMs, nowMs)`

Format time elapsed since an event as a short string in French.

```typescript
function agoShort(fromMs: number, nowMs: number): string
```

**Parameters:**
- `fromMs` - Start time in milliseconds
- `nowMs` - Current time in milliseconds

**Returns:** Formatted time string  
**Examples:**
```typescript
agoShort(now - 5*60*1000, now);      // "5 min"
agoShort(now - 2.5*3600*1000, now);  // "2h30"
agoShort(now - 3.5*86400*1000, now); // "3j12h"
```

**Formatting Rules:**
- < 1 hour: "X min"
- < 1 day: "Xh" or "XhY" (with minutes)
- ≥ 1 day: "Xj" or "XjYh" (with hours)

---

#### `babyAgeLabel(birthISO)`

Calculate baby's age from birth date and format as label.

```typescript
function babyAgeLabel(birthISO: string): string
```

**Parameters:**
- `birthISO` - Birth date in ISO 8601 format

**Returns:** Age label in French  
**Examples:**
```typescript
babyAgeLabel("2025-01-15T00:00:00Z"); // "10 jours"
babyAgeLabel("2024-10-01T00:00:00Z"); // "3 mois"
```

---

#### `isInQuietHours(date, quietStartHour, quietEndHour)`

Check if a given date falls within quiet hours.

```typescript
function isInQuietHours(date: Date, quietStartHour: number, quietEndHour: number): boolean
```

**Parameters:**
- `date` - Date to check
- `quietStartHour` - Quiet hours start (0-23)
- `quietEndHour` - Quiet hours end (0-23)

**Returns:** `true` if in quiet hours  
**Examples:**
```typescript
// Normal range (8am-5pm)
isInQuietHours(new Date('2025-01-25T10:00:00'), 8, 17); // true
isInQuietHours(new Date('2025-01-25T18:00:00'), 8, 17); // false

// Overnight range (10pm-7am)
isInQuietHours(new Date('2025-01-25T23:00:00'), 22, 7); // true
isInQuietHours(new Date('2025-01-25T03:00:00'), 22, 7); // true
isInQuietHours(new Date('2025-01-25T10:00:00'), 22, 7); // false
```

---

#### `nextAllowedTimeMs(fireAtMs, quietStartHour, quietEndHour)`

Calculate the next allowed time outside of quiet hours.

```typescript
function nextAllowedTimeMs(fireAtMs: number, quietStartHour: number, quietEndHour: number): number
```

**Parameters:**
- `fireAtMs` - Desired fire time in milliseconds
- `quietStartHour` - Quiet hours start (0-23)
- `quietEndHour` - Quiet hours end (0-23)

**Returns:** Adjusted time in milliseconds  
**Behavior:**
- If time is outside quiet hours, returns unchanged
- If inside quiet hours, adjusts to end of quiet hours
- Handles overnight quiet periods correctly

**Example:**
```typescript
// Quiet hours: 22:00-07:00
// Desired time: 23:30 (inside quiet hours)
nextAllowedTimeMs(desiredTime, 22, 7); // Returns 07:00 next day
```

---

### Event Utilities

Located in: `src/utils/eventUtils.ts`

#### `diaperLabel(t)`

Get French label for diaper type.

```typescript
function diaperLabel(t: string): string
```

**Parameters:**
- `t` - Diaper type: `'pee'` | `'poo'` | `'mixed'`

**Returns:** French label  
**Examples:**
```typescript
diaperLabel('pee');   // "Pipi"
diaperLabel('poo');   // "Caca"
diaperLabel('mixed'); // "Mixte"
```

---

#### `eventTitle(e)`

Generate a display title for an event.

```typescript
function eventTitle(e: Event): string
```

**Parameters:**
- `e` - Event object

**Returns:** Formatted title  
**Examples:**
```typescript
eventTitle({ type: 'feeding', amountMl: 120 });         // "Repas • 120 ml"
eventTitle({ type: 'diaper', diaperType: 'pee' });      // "Couche • Pipi"
eventTitle({ type: 'sleep', endTs: undefined });        // "Dodo • en cours"
eventTitle({ type: 'sleep', endTs: 1706172345678 });    // "Dodo • terminé"
```

---

#### `eventIcon(e)`

Get icon configuration for an event type.

```typescript
function eventIcon(e: Event): { name: string; bg: string; color: string }
```

**Parameters:**
- `e` - Event object

**Returns:** Icon configuration object  
**Examples:**
```typescript
eventIcon({ type: 'sleep' });
// { name: 'moon-outline', bg: '#F3EFFA', color: '#7B61C9' }

eventIcon({ type: 'feeding' });
// { name: 'cafe-outline', bg: '#E9F7F9', color: '#2AA7B8' }

eventIcon({ type: 'diaper' });
// { name: 'water-outline', bg: '#FDF8E9', color: '#D5A02F' }
```

---

#### `calcSleepTotalBetween(events, rangeStartMs, rangeEndMs)`

Calculate total sleep duration within a time range.

```typescript
function calcSleepTotalBetween(events: Event[], rangeStartMs: number, rangeEndMs: number): number
```

**Parameters:**
- `events` - Array of all events
- `rangeStartMs` - Start of time range (milliseconds)
- `rangeEndMs` - End of time range (milliseconds)

**Returns:** Total sleep duration in milliseconds  
**Features:**
- Handles ongoing sleep sessions (endTs = undefined)
- Calculates overlapping portions correctly
- Ignores deleted events
- Handles sleep sessions that span range boundaries

**Example:**
```typescript
const todayStart = startOfDay(new Date()).getTime();
const todayEnd = todayStart + 24 * 60 * 60 * 1000;
const totalSleepMs = calcSleepTotalBetween(events, todayStart, todayEnd);
const hoursSlept = totalSleepMs / (60 * 60 * 1000); // Convert to hours
```

---

#### `filterEventsByTypeAndDate(events, type, startMs, endMs)`

Filter events by type and date range.

```typescript
function filterEventsByTypeAndDate(events: Event[], type: string, startMs: number, endMs: number): Event[]
```

**Parameters:**
- `events` - Array of all events
- `type` - Event type to filter
- `startMs` - Start timestamp (inclusive)
- `endMs` - End timestamp (exclusive)

**Returns:** Filtered array of events  
**Example:**
```typescript
const todayFeedings = filterEventsByTypeAndDate(
  allEvents,
  'feeding',
  todayStart,
  todayEnd
);
```

---

#### `getLastEventOfType(events, type)`

Get the most recent event of a specific type.

```typescript
function getLastEventOfType(events: Event[], type: string): Event | null
```

**Parameters:**
- `events` - Array of all events
- `type` - Event type to find

**Returns:** Most recent event or `null`  
**Example:**
```typescript
const lastFeeding = getLastEventOfType(events, 'feeding');
if (lastFeeding) {
  const timeSince = Date.now() - lastFeeding.ts;
}
```

---

#### `getActiveSleepSession(events)`

Check if there's an ongoing sleep session.

```typescript
function getActiveSleepSession(events: Event[]): Event | null
```

**Parameters:**
- `events` - Array of all events

**Returns:** Active sleep event or `null`  
**Example:**
```typescript
const activeSleep = getActiveSleepSession(events);
if (activeSleep) {
  console.log('Baby is currently sleeping since', activeSleep.startTs);
}
```

---

### Storage Utilities

Located in: `src/utils/storageUtils.ts`

#### `loadJson<T>(key, fallback)`

Load and parse JSON data from AsyncStorage.

```typescript
async function loadJson<T>(key: string, fallback: T): Promise<T>
```

**Parameters:**
- `key` - Storage key
- `fallback` - Default value if key doesn't exist

**Returns:** Promise resolving to parsed data or fallback  
**Example:**
```typescript
const settings = await loadJson<Settings>('bt_settings_v3', defaultSettings);
```

---

#### `saveJson(key, value)`

Save data to AsyncStorage as JSON.

```typescript
async function saveJson(key: string, value: any): Promise<void>
```

**Parameters:**
- `key` - Storage key
- `value` - Data to store (will be JSON stringified)

**Returns:** Promise that resolves when save completes  
**Example:**
```typescript
await saveJson('bt_settings_v3', updatedSettings);
```

---

#### `safeParseJson(text)`

Safely parse JSON string with error handling.

```typescript
function safeParseJson(text: string): { ok: boolean; value?: any; error?: string }
```

**Parameters:**
- `text` - JSON string to parse

**Returns:** Result object with status  
**Example:**
```typescript
const result = safeParseJson(userInput);
if (result.ok) {
  const data = result.value;
  // Use data
} else {
  console.error(result.error); // "JSON invalide"
}
```

---

### Sleep Planner Algorithm

Located in: `src/utils/sleepplannerAlgo.ts`

#### `computeNextSleepPlan(baby, sleepEvents, settings, nowMs)`

Main algorithm that computes the next optimal sleep window (sweet spot) for baby.

```typescript
function computeNextSleepPlan(
  baby: Baby,
  sleepEvents: Event[],
  settings: SleepPlannerSettings,
  nowMs: number
): SleepPlannerResult
```

**Parameters:**
- `baby` - Baby profile with `birthDateISO`
- `sleepEvents` - Array of all sleep events
- `settings` - Sleep planner configuration
  - `napCountMode` - `'auto'` or manual count (`'1'`, `'2'`, `'3'`, `'4'`)
  - `nudgeMin` - Manual adjustment in minutes (±)
  - `bedtimeTargetHHMM` - Fixed bedtime (e.g., `"19:30"`)
  - `windowHalfWidthMin` - Sweet spot window half-width
- `nowMs` - Current time in milliseconds

**Returns:** Sleep planner result object

```typescript
interface SleepPlannerResult {
  window: {
    slotIndex: number;        // Which nap (0-based)
    slotType: 'nap' | 'bedtime';
    earliestMs: number;       // Window start
    targetMs: number;         // Optimal target
    latestMs: number;         // Window end
  } | null;
  countdown: {
    status: 'too_early' | 'ideal' | 'too_late' | 'unknown';
    minutesUntil: number;     // Minutes until target (negative if past)
    message: string;          // French user-facing message
  };
}
```

**Algorithm Overview:**

1. **Age Analysis**: Calculate baby's age and lookup base wake window
2. **Nap Detection**: Determine if predicting nap or bedtime
3. **Last Wake Time**: Find when baby last woke up
4. **Slot Identification**: Determine which nap in sequence (1st, 2nd, 3rd)
5. **Day Factor**: Apply time-of-day multiplier to wake window
6. **Calibration**: Analyze recent data to adjust for baby's patterns
7. **User Nudge**: Apply manual adjustment from settings
8. **Bedtime Override**: Use fixed bedtime for last sleep of day
9. **Window Generation**: Create time window (earliest, target, latest)
10. **Countdown**: Generate user-friendly status message

**Data Requirements:**
- Minimum 3 sleep events (MIN_EVENTS_FOR_PREDICTION)
- At least one completed sleep session
- Data not older than 12 hours (STALE_DATA_THRESHOLD_HOURS)

**Example:**
```typescript
const result = computeNextSleepPlan(
  { birthDateISO: '2024-06-01T00:00:00Z' },
  sleepEvents,
  {
    napCountMode: 'auto',
    nudgeMin: 0,
    bedtimeTargetHHMM: '19:30',
    windowHalfWidthMin: 15
  },
  Date.now()
);

if (result.window) {
  console.log('Next sleep window:');
  console.log('Type:', result.window.slotType);
  console.log('Target:', new Date(result.window.targetMs));
  console.log('Status:', result.countdown.message);
}
```

**Calibration Logic:**

The algorithm uses statistical analysis of recent sleep patterns:
- Analyzes last 7 days of sleep data (CALIBRATION_WINDOW_DAYS)
- Calculates median wake window for each nap slot
- Adjusts age-based defaults by up to ±30 minutes (MAX_CALIBRATION_DELTA_MIN)
- Uses median (not mean) to be robust against outliers

**Edge Cases:**
- Returns `null` window if insufficient data
- Returns "Données obsolètes" if last wake > 12 hours ago
- Returns "Journée terminée" if all naps + bedtime completed

---

## Context API

All contexts defined in: `src/contexts/index.tsx`

### BabyContext

Manages baby profile data.

```typescript
interface BabyContextValue {
  baby: Baby | null;
  onUpdateBaby: (updates: Partial<Baby>) => void;
  onCreateBaby: (baby: Baby) => void;
  clearBaby: () => void;
}
```

**Usage:**
```typescript
const { baby, onUpdateBaby } = useBaby();

onUpdateBaby({ name: 'Emma', sex: 'female' });
```

---

### EventsContext

Manages event tracking and CRUD operations.

```typescript
interface EventsContextValue {
  events: Event[];
  logFeeding: (amountMl: number, caregiverId: string) => void;
  logDiaper: (diaperType: string, caregiverId: string) => void;
  startSleep: (caregiverId: string) => void;
  endSleep: (eventId: string) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  undoDelete: (id: string) => void;
  replaceAllEvents: (newEvents: Event[]) => void;
}
```

**Usage:**
```typescript
const { events, logFeeding, startSleep } = useEvents();

// Log feeding
logFeeding(120, caregiverId);

// Start sleep session
startSleep(caregiverId);

// Update event
updateEvent(eventId, { amountMl: 150 });

// Delete event
deleteEvent(eventId);

// Undo delete
undoDelete(eventId);
```

---

### SettingsContext

Manages app preferences.

```typescript
interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

interface Settings {
  defaultFeedingAmountMl: number;
  defaultDiaperType: string;
  reminderEnabled: boolean;
  quietStartHour: number;
  quietEndHour: number;
  feedingGapHours: number;
  maxRemindersPerDay: number;
}
```

**Usage:**
```typescript
const { settings, updateSettings } = useSettings();

updateSettings({
  quietStartHour: 22,
  quietEndHour: 7
});
```

---

### RemindersContext

Manages notification reminders.

```typescript
interface RemindersContextValue {
  reminders: Reminder[];
  reminderSettings: ReminderSettings;
  scheduleReminder: (kind: string, delayHours: number) => Promise<void>;
  dismissReminder: (id: string) => void;
  updateReminderSettings: (updates: Partial<ReminderSettings>) => void;
}
```

**Usage:**
```typescript
const { scheduleReminder, dismissReminder } = useReminders();

// Schedule feeding reminder in 3 hours
await scheduleReminder('feeding', 3);

// Dismiss reminder
dismissReminder(reminderId);
```

---

### CaregiverContext

Manages caregiver information.

```typescript
interface CaregiverContextValue {
  caregiver: Caregiver;
  updateCaregiver: (updates: Partial<Caregiver>) => void;
}
```

---

### ToastContext

Manages toast notifications with undo support.

```typescript
interface ToastContextValue {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

interface ToastConfig {
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}
```

**Usage:**
```typescript
const toast = useToast();

toast.show({
  message: 'Événement supprimé',
  action: {
    label: 'Annuler',
    onPress: () => undoDelete(eventId)
  }
});
```

---

## Component API

### Performance-Optimized Components

All UI components are memoized with `React.memo()` for optimal performance:

- `EventRow` - List item for event display
- `MiniMetric` - Dashboard metric display
- `Chip` - Filter chip button
- `GradientTile` - Quick action button
- `Card` - Container component
- `Divider` - Section divider
- `Stepper` - Numeric control
- `EmptyState` - Empty state display
- `BottomSheet` - Modal sheet
- `ActionToast` - Toast notification

### EventRow

```typescript
interface EventRowProps {
  e: Event;
  onPress: (event: Event) => void;
}
```

**Usage:**
```typescript
<EventRow
  e={event}
  onPress={(e) => setEditEvent(e)}
/>
```

---

### GradientTile

```typescript
interface GradientTileProps {
  icon: string;
  title: string;
  subtitle?: string;
  colors: [string, string];
  onPress: () => void;
}
```

**Usage:**
```typescript
<GradientTile
  icon="cafe-outline"
  title="Repas"
  subtitle="120 ml"
  colors={['#7ED1DD', '#56C0D0']}
  onPress={() => logFeeding(120)}
/>
```

---

### BottomSheet

```typescript
interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**Usage:**
```typescript
<BottomSheet
  visible={isVisible}
  onClose={() => setVisible(false)}
>
  {/* Sheet content */}
</BottomSheet>
```

---

## Type Definitions

Complete type definitions in: `src/types/index.ts`

### Baby

```typescript
interface Baby {
  id: string;
  name: string;
  birthDateISO: string;
  avatar: string;
  sex: 'male' | 'female';
  createdAt: string;
}
```

---

### Event

```typescript
interface Event {
  id: string;
  babyId: string;
  caregiverId: string;
  type: 'feeding' | 'sleep' | 'diaper';
  ts: number;
  
  // Feeding specific
  amountMl?: number;
  
  // Diaper specific
  diaperType?: 'pee' | 'poo' | 'mixed';
  
  // Sleep specific
  startTs?: number;
  endTs?: number;
  
  // Metadata
  notes?: string;
  deletedAt?: number;
}
```

---

### Settings

```typescript
interface Settings {
  defaultFeedingAmountMl: number;
  defaultDiaperType: string;
  reminderEnabled: boolean;
  quietStartHour: number;      // 0-23
  quietEndHour: number;         // 0-23
  feedingGapHours: number;
  maxRemindersPerDay: number;
}
```

---

### Reminder

```typescript
interface Reminder {
  id: string;
  kind: 'feeding' | 'diaper';
  createdAt: number;
  fireAtMs: number;
  notifId?: string;
  firedAt?: number;
  dismissedAt?: number;
}
```

---

### SleepPlannerSettings

```typescript
interface SleepPlannerSettings {
  napCountMode: 'auto' | '1' | '2' | '3' | '4';
  nudgeMin: number;              // Manual adjustment ±
  bedtimeTargetHHMM: string;     // "HH:MM" format
  windowHalfWidthMin: number;    // Sweet spot window half-width
}
```

---

## Storage Keys

All data persisted to AsyncStorage:

```typescript
const STORAGE_KEYS = {
  BABY: 'bt_baby_v3',
  SETTINGS: 'bt_settings_v3',
  EVENTS: 'bt_events_v3',
  CAREGIVER: 'bt_caregiver_v3',
  REMINDERS: 'bt_reminders_v3',
  REMINDER_SETTINGS: 'bt_reminder_settings_v3'
};
```

---

## Constants

### Theme Colors

Located in: `src/constants/theme.ts`

```typescript
export const THEME = {
  bg: '#FBF8F2',          // Warm cream background
  text: '#3C3C3C',        // Primary text
  muted: '#9B9B9B',       // Secondary text
  card: '#FFFFFF',        // Card background
  border: '#E8E8E8',      // Border color
  
  // Icon backgrounds
  iconBgPurple: '#F3EFFA',
  iconBgTeal: '#E9F7F9',
  iconBgYellow: '#FDF8E9',
  
  // Gradients
  purple1: '#BCA7E6',
  purple2: '#A98EE2',
  teal1: '#7ED1DD',
  teal2: '#56C0D0',
  yellow1: '#F3D27B',
  yellow2: '#EEC15F'
};
```

---

## Error Handling

All async functions include try-catch blocks with console.error logging:

```typescript
try {
  await AsyncStorage.setItem(key, JSON.stringify(value));
} catch (error) {
  console.error(`Error saving ${key}:`, error);
  throw error;
}
```

---

## Testing Utilities

Located in: `src/test-utils.tsx`

### renderWithProviders

Render components with all context providers for testing.

```typescript
function renderWithProviders(ui: React.ReactElement): RenderResult
```

**Usage:**
```typescript
import { renderWithProviders } from '../test-utils';

test('renders correctly', () => {
  const { getByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
  expect(getByText('Emma')).toBeTruthy();
});
```

---

## Best Practices

### Performance

- All UI components use `React.memo()`
- Expensive calculations wrapped in `useMemo()`
- Event handlers wrapped in `useCallback()`
- AsyncStorage operations batched when possible

### Type Safety

- All functions have explicit return types
- All parameters have type annotations
- Interfaces defined for all data structures
- No use of `any` type in production code

### Error Handling

- All async operations wrapped in try-catch
- Fallback values provided for all data loads
- User-friendly error messages in French
- Console logging for debugging

---

## Migration Notes

### v3 Storage Format

Current storage keys use `_v3` suffix. If migrating from older versions:

```typescript
// Old key (v2)
const oldKey = 'bt_baby_v2';

// New key (v3)
const newKey = 'bt_baby_v3';

// Migration example
const oldData = await loadJson(oldKey, null);
if (oldData) {
  await saveJson(newKey, transformDataV2toV3(oldData));
  await AsyncStorage.removeItem(oldKey);
}
```

---

## Support & Contributing

For questions, bug reports, or contributions:

1. Check this API documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Review [README.md](./README.md) for user-facing features
4. Run tests before submitting changes: `npm test`
5. Follow TypeScript best practices
6. Add JSDoc comments for all public functions

---

**Last Updated:** January 25, 2026  
**Version:** 2.0.0  
**Test Coverage:** 106 tests passing

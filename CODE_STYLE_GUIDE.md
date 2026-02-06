# Kumo - Code Style Guide

## Overview

This document defines coding conventions and best practices for the Kumo project. Following these guidelines ensures consistency and maintainability.

## File Organization

### File Naming
- **Components**: PascalCase (e.g., `Card.js`, `GradientTile.js`)
- **Utilities**: camelCase (e.g., `dateUtils.js`, `storageUtils.js`)
- **Screens**: PascalCase with "Screen" suffix (e.g., `HomeScreen.js`)
- **Hooks**: camelCase with "use" prefix (e.g., `useReminders.js`)

### File Structure
```javascript
// 1. Imports (external first, then internal)
import React from 'react';
import { View } from 'react-native';
import { THEME } from '../constants';

// 2. Constants (if any)
const MAX_VALUE = 100;

// 3. Helper functions (if needed by this file only)
function localHelper() { }

// 4. Main component/function
export function MyComponent() { }

// 5. Additional exports (if any)
export { helperFunction };
```

## JavaScript/React Conventions

### Component Definition

**Prefer function components:**
```javascript
// ✅ GOOD: Function component
export function Card({ children, style }) {
  return <View style={style}>{children}</View>;
}

// ❌ AVOID: Class components (unless necessary)
class Card extends React.Component { }
```

### Props Destructuring

**Always destructure props in function signature:**
```javascript
// ✅ GOOD: Clear props
function EventRow({ e, onPress }) {
  // Use e and onPress directly
}

// ❌ AVOID: Props object
function EventRow(props) {
  const e = props.e;
  const onPress = props.onPress;
}
```

### Hooks

**Call hooks at the top level:**
```javascript
// ✅ GOOD
function MyComponent() {
  const [value, setValue] = useState(0);
  const memoized = useMemo(() => compute(), [dep]);
  
  if (condition) return null;
  return <View />;
}

// ❌ AVOID: Conditional hooks
function MyComponent() {
  if (condition) {
    const [value, setValue] = useState(0); // ERROR!
  }
}
```

## Naming Conventions

### Variables

```javascript
// ✅ GOOD: Descriptive camelCase
const feedingAmount = 120;
const isSleeping = true;
const lastEventTime = Date.now();

// ❌ AVOID: Unclear abbreviations
const fa = 120;
const sleeping = true;
const let = Date.now();
```

### Constants

```javascript
// ✅ GOOD: UPPER_SNAKE_CASE for true constants
const MAX_REMINDERS_PER_DAY = 6;
const DEFAULT_FEEDING_ML = 120;

// ✅ GOOD: PascalCase for constant objects
const THEME = { bg: '#FFF' };
const STORAGE_KEYS = { BABY: 'baby_v3' };

// ❌ AVOID: Mixed case
const MaxReminders = 6;
const default_feeding = 120;
```

### Functions

```javascript
// ✅ GOOD: Verb + noun, descriptive
function calculateSleepTotal() { }
function formatEventTitle() { }
function isInQuietHours() { }

// ❌ AVOID: Unclear or noun-only
function sleep() { }
function event() { }
function hours() { }
```

### Event Handlers

```javascript
// ✅ GOOD: "handle" or "on" prefix
function handlePress() { }
function onEventSelect() { }

// Callback props use "on" prefix
<Button onPress={handlePress} />
```

### Boolean Variables

```javascript
// ✅ GOOD: "is", "has", "can" prefix
const isLoading = true;
const hasEvents = events.length > 0;
const canEdit = permissions.includes('edit');

// ❌ AVOID: Ambiguous names
const loading = true;
const events = true;
```

## JSDoc Comments

### Function Documentation

**Always document exported functions:**

```javascript
/**
 * Calculate the total sleep duration within a time range
 * 
 * Handles ongoing sleep sessions and overlapping time ranges.
 * Ignores deleted events.
 * 
 * @param {Array<Object>} events - Array of all events
 * @param {number} rangeStartMs - Start of time range in milliseconds
 * @param {number} rangeEndMs - End of time range in milliseconds
 * @returns {number} Total sleep duration in milliseconds
 * 
 * @example
 * const total = calcSleepTotalBetween(events, startOfDay, endOfDay);
 * console.log(`Total: ${total / 3600000} hours`);
 */
export function calcSleepTotalBetween(events, rangeStartMs, rangeEndMs) {
  // Implementation
}
```

### Component Documentation

```javascript
/**
 * GradientTile Component
 * 
 * A large, tappable button with gradient background, icon, and label.
 * Used for primary quick-action buttons on the home screen.
 * 
 * @param {Object} props
 * @param {string} props.title - Button label text
 * @param {string} props.iconName - Ionicons icon name
 * @param {string[]} props.colors - Gradient colors [start, end]
 * @param {Function} props.onPress - Callback when pressed
 * 
 * @example
 * <GradientTile
 *   title="Dodo"
 *   iconName="moon-outline"
 *   colors={[THEME.purpleA, THEME.purpleB]}
 *   onPress={handleSleep}
 * />
 */
export function GradientTile({ title, iconName, colors, onPress }) {
  // Implementation
}
```

## Code Style

### Spacing and Indentation

```javascript
// ✅ GOOD: 2-space indentation
function example() {
  if (condition) {
    doSomething();
  }
}

// ✅ GOOD: Space after keywords
if (condition) { }
for (const item of items) { }

// ❌ AVOID: No space after keywords
if(condition) { }
for(const item of items) { }
```

### Line Length

**Keep lines under 100 characters when possible:**

```javascript
// ✅ GOOD: Break long lines
const event = {
  id: makeId(),
  type: 'feeding',
  amountMl: 120,
  caregiverId: caregiver.id,
};

// ❌ AVOID: Long lines
const event = { id: makeId(), type: 'feeding', amountMl: 120, caregiverId: caregiver.id };
```

### Object and Array Formatting

```javascript
// ✅ GOOD: Multi-line for readability
const config = {
  pushEnabled: true,
  quietHoursEnabled: true,
  quietStartHour: 22,
  quietEndHour: 7,
};

// ✅ GOOD: Single line for short objects
const point = { x: 10, y: 20 };

// ✅ GOOD: Trailing commas
const items = [
  'item1',
  'item2',
  'item3', // Easier to add new items
];
```

## React Specific

### Component Props

```javascript
// ✅ GOOD: Destructure with defaults
function Card({ 
  children, 
  style, 
  elevated = true,
  padding = 16 
}) {
  // Use defaults
}

// ✅ GOOD: Spread remaining props
function Button({ title, ...rest }) {
  return <Pressable {...rest}><Text>{title}</Text></Pressable>;
}
```

### Conditional Rendering

```javascript
// ✅ GOOD: Early return for simple conditions
if (!data) return null;
if (loading) return <Spinner />;

// ✅ GOOD: && for inline conditionals
{showIcon && <Icon name="check" />}

// ✅ GOOD: Ternary for if-else
{isActive ? <ActiveView /> : <InactiveView />}

// ❌ AVOID: Complex nested ternaries
{isActive ? (hasData ? <View1 /> : <View2 />) : (loading ? <View3 /> : <View4 />)}
```

### Event Handlers

```javascript
// ✅ GOOD: Inline arrow for simple cases
<Button onPress={() => setValue(value + 1)} />

// ✅ GOOD: Named function for complex logic
const handleSubmit = useCallback(() => {
  validateForm();
  saveData();
  navigate('Success');
}, [validateForm, saveData, navigate]);

<Button onPress={handleSubmit} />
```

### State Updates

```javascript
// ✅ GOOD: Functional updates for derived state
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);

// ❌ AVOID: Direct state dependency
setCount(count + 1); // May use stale value
```

## French Language

### User-Facing Text

All user-facing text should be in French:

```javascript
// ✅ GOOD: French for users
<Text>Aucun événement</Text>
<Button title="Ajouter" />
const message = "Rappel créé";

// ✅ GOOD: English for code
function handleButtonPress() { }
const isLoading = true;
```

### Comments

```javascript
// ✅ GOOD: English for technical comments
// Calculate the average sleep duration

// ✅ GOOD: French for business logic comments
// Vérifie si l'utilisateur peut créer plus de rappels

// Either is acceptable, be consistent within a file
```

## Error Handling

### Try-Catch

```javascript
// ✅ GOOD: Specific error handling
try {
  const data = await loadJson(key, fallback);
  processData(data);
} catch (error) {
  console.error(`Failed to load ${key}:`, error);
  return fallback;
}

// ❌ AVOID: Silent failures
try {
  await loadJson(key);
} catch (e) {
  // Nothing
}
```

### Validation

```javascript
// ✅ GOOD: Early validation
function scheduleReminder(time) {
  if (!time) {
    console.warn('Time is required');
    return null;
  }
  
  if (time < Date.now()) {
    console.warn('Cannot schedule in the past');
    return null;
  }
  
  // Proceed with scheduling
}
```

## Performance

### useMemo and useCallback

```javascript
// ✅ GOOD: Memoize expensive calculations
const sleepTotal = useMemo(() => 
  calcSleepTotalBetween(events, startOfDay, endOfDay),
  [events, startOfDay, endOfDay]
);

// ✅ GOOD: useCallback for stable references
const handlePress = useCallback(() => {
  saveEvent(event);
}, [event]);

// ❌ AVOID: Premature optimization
const sum = useMemo(() => a + b, [a, b]); // Too simple
```

### List Rendering

```javascript
// ✅ GOOD: Key prop for lists
{events.map(event => (
  <EventRow key={event.id} event={event} />
))}

// ❌ AVOID: Index as key (if order can change)
{events.map((event, index) => (
  <EventRow key={index} event={event} />
))}
```

## Testing (Future)

### Test File Naming

```
MyComponent.js       → MyComponent.test.js
dateUtils.js         → dateUtils.test.js
```

### Test Structure

```javascript
describe('calcSleepTotalBetween', () => {
  it('calculates total sleep in range', () => {
    const events = [/* ... */];
    const result = calcSleepTotalBetween(events, start, end);
    expect(result).toBe(expected);
  });
  
  it('handles ongoing sleep sessions', () => {
    // Test case
  });
  
  it('ignores deleted events', () => {
    // Test case
  });
});
```

## Git Commit Messages

```
✅ GOOD: Clear, descriptive commits
feat: Add sleep duration chart to stats screen
fix: Correct quiet hours calculation for overnight range
docs: Update README with installation steps
refactor: Extract date utilities to separate file

❌ AVOID: Vague commits
update stuff
fix bug
changes
wip
```

## Common Patterns

### Loading State

```javascript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  async function load() {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

if (loading) return <Spinner />;
if (!data) return <EmptyState />;
return <DataView data={data} />;
```

### Form State

```javascript
const [name, setName] = useState('');
const [amount, setAmount] = useState(120);

const handleSubmit = () => {
  if (!name) {
    Alert.alert('Error', 'Name is required');
    return;
  }
  
  saveData({ name, amount });
};
```

## Tools and Linting

### Recommended (Future)

- **ESLint**: For code quality
- **Prettier**: For formatting
- **TypeScript**: For type safety

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "javascript.preferences.quoteStyle": "double",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

**Remember**: Consistency is more important than perfection. When in doubt, follow the patterns already established in the codebase! 🎯

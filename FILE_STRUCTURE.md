# Kumo - File Structure Overview

## 📁 Complete File Structure

```
Kumo/
│
├── 📄 README.md                          ★ START HERE - Complete app guide
├── 📄 ARCHITECTURE.md                    Deep dive into technical design
├── 📄 REFACTORING_GUIDE.md               Step-by-step migration instructions
├── 📄 CODE_STYLE_GUIDE.md                Coding standards and conventions
├── 📄 DOCUMENTATION_SUMMARY.md           What was done and next steps
│
├── 📄 App.js                             ⚠️ Original monolithic file (2590 lines)
├── 📄 index.js                           Entry point
├── 📄 app.json                           Expo configuration
├── 📄 package.json                       Dependencies
├── 📄 .gitignore                         Git ignore rules
│
├── 📁 src/                               ✨ NEW - Modular, documented code
│   │
│   ├── 📁 constants/                     Configuration and theme
│   │   ├── index.js                      Exports all constants
│   │   └── theme.js                      Colors, storage keys, defaults (120 lines)
│   │
│   ├── 📁 utils/                         Utility functions
│   │   ├── index.js                      Exports all utilities
│   │   ├── dateUtils.js                  Date/time calculations (90 lines)
│   │   ├── eventUtils.js                 Event helpers (80 lines)
│   │   └── storageUtils.js               AsyncStorage wrappers (30 lines)
│   │
│   └── 📁 components/                    Reusable UI components
│       ├── index.js                      Exports all components
│       ├── Card.js                       Container component (20 lines)
│       ├── Divider.js                    Line separator (15 lines)
│       ├── GradientTile.js               Action button (35 lines)
│       ├── MiniMetric.js                 Stat display (40 lines)
│       ├── EmptyState.js                 No data placeholder (35 lines)
│       ├── EventRow.js                   Event list item (50 lines)
│       ├── Chip.js                       Filter button (35 lines)
│       ├── Stepper.js                    Numeric control (60 lines)
│       ├── BottomSheet.js                Modal container (50 lines)
│       └── ActionToast.js                Floating notification (80 lines)
│
├── 📁 assets/                            Images and static files
│   └── ...
│
└── 📁 components/                        ⚠️ Legacy folder
    └── AssetExample.js                   Example component
```

## 📊 Code Distribution

### Current State
```
Original Code (App.js):                   2,590 lines  ██████████████████████
Documentation:                            1,700 lines  ██████████████
Extracted & Documented Code:                820 lines  ███████
                                                      
Total Added:                              2,520 lines
```

### After Refactoring (Projected)
```
Components (src/components/):               500 lines  ████
Screens (src/screens/):                     800 lines  ███████
Utils (src/utils/):                         200 lines  ██
Constants (src/constants/):                 120 lines  █
Hooks (src/hooks/):                         200 lines  ██
Navigation (src/navigation/):               150 lines  █
App.js (simplified):                        200 lines  ██
                                                      
Total:                                    2,170 lines  (vs 2,590 original)
Reduction:                                  -420 lines  (more organized!)
```

## 🗂️ File Categories

### 📘 Documentation Files (4 files)
| File | Lines | Purpose | When to Read |
|------|-------|---------|--------------|
| README.md | ~350 | App overview, features, setup | Always start here |
| ARCHITECTURE.md | ~500 | Technical design, data flow | Before coding |
| REFACTORING_GUIDE.md | ~450 | Migration instructions | Before refactoring |
| CODE_STYLE_GUIDE.md | ~400 | Coding conventions | While coding |
| DOCUMENTATION_SUMMARY.md | ~200 | What was done | Quick reference |

### 💻 Source Code Files

#### Constants (1 file)
| File | Exports | Purpose |
|------|---------|---------|
| constants/theme.js | THEME, STORAGE_KEYS, DEFAULT_SETTINGS | All configuration |

#### Utilities (3 files)
| File | Key Functions | Purpose |
|------|---------------|---------|
| utils/dateUtils.js | makeId, agoShort, babyAgeLabel | Date/time operations |
| utils/eventUtils.js | eventTitle, eventIcon, calcSleepTotalBetween | Event helpers |
| utils/storageUtils.js | loadJson, saveJson, safeParseJson | Storage operations |

#### Components (10 files)
| File | Component | Usage |
|------|-----------|-------|
| Card.js | Card | Container for content |
| Divider.js | Divider | Horizontal separator |
| GradientTile.js | GradientTile | Primary action buttons |
| MiniMetric.js | MiniMetric | Statistics display |
| EmptyState.js | EmptyState | No data placeholder |
| EventRow.js | EventRow | Event list items |
| Chip.js | Chip | Filter/selection buttons |
| Stepper.js | Stepper | Numeric input |
| BottomSheet.js | BottomSheet | Modal container |
| ActionToast.js | ActionToast | Notification overlay |

## 📈 Documentation Coverage

```
Constants:              100% ✅  All exported values documented
Utilities:              100% ✅  All functions with JSDoc
Components:             100% ✅  All props and usage documented
Screens (in App.js):      0% ⚠️   Not yet extracted
Hooks (in App.js):        0% ⚠️   Not yet extracted
```

## 🎯 Import Map

### How to Import from New Structure

```javascript
// Constants
import { 
  THEME,                    // Color palette
  STORAGE_KEYS,             // AsyncStorage keys
  DEFAULT_SETTINGS,         // Default app settings
  DEFAULT_CAREGIVER,        // Default caregiver profile
  DEFAULT_REMINDER_SETTINGS,// Default reminder config
  TIME_CONSTANTS,           // Time multipliers
  EVENT_TYPES,              // Event type constants
  DIAPER_TYPES              // Diaper type constants
} from './src/constants';

// Date Utils
import {
  makeId,                   // Generate unique IDs
  round1,                   // Round to 1 decimal
  msToHours,                // Convert ms to hours
  agoShort,                 // Format time elapsed
  babyAgeLabel,             // Calculate baby age
  isInQuietHours,           // Check quiet hours
  nextAllowedTimeMs         // Adjust for quiet hours
} from './src/utils';

// Event Utils
import {
  diaperLabel,              // Get diaper type label
  eventTitle,               // Format event title
  eventIcon,                // Get event icon config
  calcSleepTotalBetween,    // Calculate sleep duration
  filterEventsByTypeAndDate,// Filter events
  getLastEventOfType,       // Get most recent event
  getActiveSleepSession     // Find ongoing sleep
} from './src/utils';

// Storage Utils
import {
  loadJson,                 // Load from AsyncStorage
  saveJson,                 // Save to AsyncStorage
  safeParseJson             // Parse JSON safely
} from './src/utils';

// Components (UI Building Blocks)
import {
  Card,                     // Container component
  Divider,                  // Horizontal line
  GradientTile,             // Large action button
  MiniMetric,               // Stat display
  EmptyState,               // No data view
  EventRow,                 // Event list item
  Chip,                     // Filter button
  Stepper,                  // Numeric control
  BottomSheet,              // Modal container
  ActionToast               // Floating notification
} from './src/components';
```

## 📝 Quick Navigation Guide

### "I want to..."

#### Understand the App
→ Start with [README.md](./README.md)

#### Understand the Code
→ Read [ARCHITECTURE.md](./ARCHITECTURE.md)

#### Refactor the Code
→ Follow [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)

#### Write New Code
→ Check [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md)

#### Find a Component
→ Look in `src/components/`

#### Find a Utility
→ Look in `src/utils/`

#### Find a Color/Constant
→ Look in `src/constants/theme.js`

#### Add a Screen
→ Create in `src/screens/` (future)

#### Add a Hook
→ Create in `src/hooks/` (future)

## 🔍 Search Tips

### Find by Feature
- **Sleep tracking**: Search "sleep" in `eventUtils.js` and `App.js`
- **Reminders**: Search "reminder" in `App.js` (will be extracted to hooks)
- **Statistics**: Search "Stats" in `App.js` (will be extracted to screen)
- **Styling**: Search in `constants/theme.js`

### Find by Component
- **Buttons**: `GradientTile.js`, `Chip.js`
- **Layouts**: `Card.js`, `BottomSheet.js`
- **Lists**: `EventRow.js`, `EmptyState.js`
- **Controls**: `Stepper.js`
- **Notifications**: `ActionToast.js`

### Find by Function Type
- **Date operations**: `utils/dateUtils.js`
- **Event operations**: `utils/eventUtils.js`
- **Storage operations**: `utils/storageUtils.js`

## 📦 Size Breakdown

```
Documentation Files:
  README.md                    350 lines
  ARCHITECTURE.md              500 lines
  REFACTORING_GUIDE.md         450 lines
  CODE_STYLE_GUIDE.md          400 lines
  DOCUMENTATION_SUMMARY.md     200 lines
  FILE_STRUCTURE.md            100 lines
  ─────────────────────────────────────
  Total Documentation:       2,000 lines

New Source Code:
  src/constants/               120 lines
  src/utils/                   200 lines
  src/components/              500 lines
  ─────────────────────────────────────
  Total New Code:              820 lines

Original Code:
  App.js                     2,590 lines
  ─────────────────────────────────────
  
Grand Total:                 5,410 lines
```

## ✅ Quality Metrics

### Documentation
- ✅ **5 comprehensive guides** covering all aspects
- ✅ **100% function documentation** with JSDoc
- ✅ **100% component documentation** with examples
- ✅ **Architecture diagrams** explaining system design
- ✅ **Migration path** with step-by-step instructions

### Code Organization
- ✅ **10 reusable components** extracted
- ✅ **15+ utility functions** documented
- ✅ **All constants** centralized
- ✅ **Clear folder structure** established
- ✅ **Index files** for clean imports

### Best Practices
- ✅ **Consistent naming** conventions defined
- ✅ **Error handling** patterns documented
- ✅ **Performance** considerations noted
- ✅ **Testing** strategy outlined
- ✅ **Git workflow** specified

---

**Navigation**: [README](./README.md) | [Architecture](./ARCHITECTURE.md) | [Refactoring](./REFACTORING_GUIDE.md) | [Style Guide](./CODE_STYLE_GUIDE.md) | [Summary](./DOCUMENTATION_SUMMARY.md)

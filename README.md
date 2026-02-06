# 🍼 Kumo - Baby Tracker App

**Kumo** is a React Native (Expo) mobile application designed for young parents with babies under 1 year old. It helps track essential baby care activities including feeding, sleep patterns, and diaper changes.

## 📱 Features

### Core Tracking
- **Feeding Tracking**: Log bottle feeding with customizable amounts (ml)
- **Sleep Monitoring**: Track sleep sessions with start/end times and duration
- **Diaper Changes**: Record diaper changes (pee, poo, or mixed)

### Smart Features
- **Real-time Updates**: Live clock showing time since last activity
- **Daily Statistics**: Visual metrics showing daily totals and averages
- **Weekly Analytics**: 7-day view with sleep duration charts
- **Smart Reminders**: Configurable reminders with quiet hours and intelligent scheduling
- **Multi-caregiver Support**: Track which caregiver logged each event
- **Quick Actions**: Fast-access buttons with gradient design for common tasks

### Data Management
- **Event History**: Complete chronological log of all activities
- **Event Editing**: Modify or delete past events
- **Export/Import**: Share data via JSON export for backup or sharing between devices
- **Persistent Storage**: All data saved locally using AsyncStorage

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native 0.81.5 with Expo ~54.0
- **Language**: TypeScript + JavaScript (gradual migration)
- **Navigation**: React Navigation (Bottom Tabs + Stack Navigator)
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications API
- **Date Management**: date-fns library
- **Testing**: Jest + React Testing Library
- **UI Components**: Modular TypeScript component library

### Project Structure
```
SleepOver/
├── App.js                          # Main app (1,422 lines - 53% reduction!)
├── src/
│   ├── screens/                    # Screen components (TypeScript)
│   │   ├── HomeScreen.tsx          # Main dashboard
│   │   ├── HistoryScreen.tsx       # Weekly calendar view
│   │   ├── StatsScreen.tsx         # Statistics & analytics
│   │   ├── OnboardingScreen.tsx    # Baby profile setup
│   │   ├── MilestonesScreen.tsx    # Development tracking
│   │   ├── settings/               # Settings screens
│   │   │   ├── SettingsHomeScreen.tsx
│   │   │   ├── BabyProfileScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   ├── ShareScreen.tsx
│   │   │   └── AppearanceScreen.tsx
│   │   └── __tests__/              # Screen tests
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Card.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── GradientTile.tsx
│   │   │   ├── MiniMetric.tsx
│   │   │   ├── EventRow.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── MiniBars.tsx
│   │   │   ├── RowNav.tsx
│   │   │   ├── ToggleRow.tsx
│   │   │   └── __tests__/
│   │   ├── SleepPlannerCard.tsx
│   │   └── SleepPlannerSettings.tsx
│   ├── features/
│   │   └── growth/                 # Growth charts feature
│   ├── hooks/
│   │   └── useSleepPlanner.ts      # Sleep planning logic
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (26)
│   └── contexts/
│       └── index.tsx                # Context providers (6)
├── web/
│   └── index.html                  # Custom web template (CSP fix)
├── assets/
├── jest.config.js
├── tsconfig.json
└── package.json
```

### Refactoring Progress
✅ **Completed:**
- Extracted 4 main screens to TypeScript
- Extracted 5 settings screens
- Created 9 reusable UI components
- Added TypeScript types (26 interfaces)
- Set up Context providers (not yet integrated)
- Created test infrastructure with Jest
- Reduced App.js from 3,035 to 1,422 lines (53.2% reduction)

### Data Structure

#### Baby Profile
```javascript
{
  id: string,
  name: string,
  birthDate: ISO8601 string,
  createdAt: timestamp
}
```

#### Events
```javascript
{
  id: string,
  type: 'feeding' | 'diaper' | 'sleep',
  ts: timestamp,
  caregiverId: string,
  
  // Feeding specific
  amountMl?: number,
  
  // Diaper specific
  diaperType?: 'pee' | 'poo' | 'mixed',
  
  // Sleep specific
  startTs?: timestamp,
  endTs?: timestamp,
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt?: timestamp
}
```

#### Reminders
```javascript
{
  id: string,
  kind: 'feeding' | 'diaper',
  createdAt: timestamp,
  fireAtMs: timestamp,
  notifId?: string,
  firedAt?: timestamp,
  dismissedAt?: timestamp
}
```

### Storage Keys
- `bt_baby_v3`: Baby profile
- `bt_settings_v3`: User preferences
- `bt_events_v3`: All events array
- `bt_caregiver_v3`: Caregiver info
- `bt_reminders_v3`: Scheduled reminders
- `bt_reminder_settings_v3`: Reminder configuration

## 🎨 Theme & Design

The app uses a soft, parent-friendly color palette:
- **Background**: Warm cream (`#FBF8F2`)
- **Cards**: White with subtle shadows
- **Gradients**: 
  - Purple (Sleep): `#BCA7E6` → `#A98EE2`
  - Teal (Feeding): `#7ED1DD` → `#56C0D0`
  - Yellow (Diaper): `#F3D27B` → `#EEC15F`

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd SleepOver
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device**
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## 🚀 Usage

### First Launch
1. Enter baby's name and birth date
2. App creates a default caregiver profile

### Tracking Activities

**Quick Actions (Home Screen)**
- Tap **Dodo** (purple) to start/stop sleep session
- Tap **Repas** (teal) to log feeding
- Tap **Couche** (yellow) to log diaper change

**Customizing Entries**
- Use stepper controls to adjust amounts
- Change diaper type with chips (Pipi/Caca/Mixte)
- Set custom time if logging past events

**Managing Events**
- View all events in **History** tab
- Tap any event to edit or delete
- Undo recent actions using toast notifications

### Reminders

**Setting Up Reminders**
1. Go to **Settings** → **Notifications**
2. Enable push notifications
3. Configure quiet hours (default 22:00-07:00)
4. Set max reminders per day

**Scheduling Reminders**
- Tap bell icon next to quick action buttons
- Select time interval (30min, 1h, 2h, 3h, etc.)
- Reminders respect quiet hours automatically

### Statistics

**Today View**
- Current time since last activity
- Today's totals for each activity type
- Sleep hours visualization

**7-Day Analytics**
- Weekly sleep patterns
- Average sleep duration
- Feeding and diaper change counts

### Data Management

**Export Data**
1. Go to **Settings** → **Partage**
2. Tap **Exporter** to generate JSON
3. Copy to clipboard or share via apps

**Import Data**
1. Copy JSON data to clipboard
2. Go to **Settings** → **Partage**
3. Tap **Importer depuis le presse-papiers**
4. Confirm to merge data

## 🔧 Configuration

### Default Settings
- Default feeding amount: 120 ml
- Default diaper type: pee
- Quiet hours: 22:00 - 07:00
- Feeding gap for reminders: 3 hours
- Max reminders per day: 6

### Customization
Edit settings via **Settings** tab:
- Baby profile (name, birth date)
- Notification preferences
- Default values for quick actions

## 📝 Development Notes

### Current Status
- ✅ Core tracking functionality (feeding, sleep, diaper)
- ✅ Statistics and analytics (daily + weekly views)
- ✅ Smart reminders system with quiet hours
- ✅ Data export/import (JSON backup)
- ✅ **Modular architecture** (26 components, 10 screens)
- ✅ **TypeScript migration** (100% src/ coverage)
- ✅ **Comprehensive test suite** (106 tests passing)
- ✅ **Performance optimizations** (React.memo, useMemo)
- ✅ **Complete documentation** (API, Architecture, README)

### Project Metrics
- **Code Reduction**: 53% reduction in App.js (3,035 → 1,318 lines)
- **Test Coverage**: 106 tests across 11 test suites
- **TypeScript Files**: 30+ files with proper interfaces
- **Components**: 20+ reusable UI components
- **Context Providers**: 6 contexts for state management
- **Documentation**: 3 comprehensive docs (README, ARCHITECTURE, API)

### Documentation

📚 **Complete Documentation Suite:**

- **[README.md](README.md)** - User guide and feature overview
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and technical architecture
- **[API.md](API.md)** - Complete API reference for all functions and components

### Code Quality

- **Type Safety**: All utility functions have JSDoc comments and TypeScript types
- **Testing**: Jest + React Testing Library with comprehensive coverage
- **Performance**: Memoized components and optimized re-renders
- **Best Practices**: Follows React and TypeScript conventions

### Next Steps (Future Enhancements)
1. **Features**: 
   - Multiple baby support
   - Cloud sync with backend
   - Photo diary with image uploads
   - Custom themes and appearance
2. **Improvements**:
   - Push notification enhancements
   - Offline-first architecture
   - Data analytics dashboard
   - Export to PDF reports

## 🤝 Contributing

This is a personal project. If you'd like to contribute or have suggestions:
1. Document any changes
2. Follow existing code style
3. Test on both iOS and Android
4. Keep French language for user-facing text

## 📄 License

This project uses the 0BSD license (see package.json).

## 👨‍👩‍👶 For Parents

**Tips for Best Results**
- Log activities as they happen for accuracy
- Use reminders during busy times
- Review weekly stats to understand patterns
- Export data regularly for backup
- Share data with partner/caregiver for coordination

**Privacy**
- All data stored locally on your device
- No data sent to external servers
- Export only to apps you trust

## 🆘 Support

For issues or questions:
- Check this README first
- Review app settings
- Try export/import to reset data
- Reinstall app if necessary (backup data first!)

---

**Made with ❤️ for exhausted parents everywhere** 🌙

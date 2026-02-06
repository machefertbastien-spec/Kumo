// Mock Expo runtime globals
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
};

// Mock structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo modules that might not be installed
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock react-native-heroicons
jest.mock('react-native-heroicons/outline', () => ({
  MoonIcon: 'MoonIcon',
  BeakerIcon: 'BeakerIcon',
  SparklesIcon: 'SparklesIcon',
  ClockIcon: 'ClockIcon',
  ChevronRightIcon: 'ChevronRightIcon',
  BellIcon: 'BellIcon',
  XMarkIcon: 'XMarkIcon',
  PlusIcon: 'PlusIcon',
  MinusIcon: 'MinusIcon',
  ChartBarIcon: 'ChartBarIcon',
  Cog6ToothIcon: 'Cog6ToothIcon',
  UserIcon: 'UserIcon',
  ShareIcon: 'ShareIcon',
  SwatchIcon: 'SwatchIcon',
  ArrowTrendingUpIcon: 'ArrowTrendingUpIcon',
}));

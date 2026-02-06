import "react-native-gesture-handler";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";

// SleepPlanner imports
import { useSleepPlanner } from './src/hooks/useSleepPlanner';
import { SleepPlannerCard } from './src/components/SleepPlannerCard';
import { SleepPlannerSettings } from './src/components/SleepPlannerSettings';

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SFIcon } from "./src/components/SFIcon";

import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";

// Growth Charts imports
import { GrowthChartsScreen, AddMeasurementSheet } from './src/features/growth';

// Milestones imports
import MilestonesScreen from './src/screens/MilestonesScreen';

// Extracted screens
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { SleepPlannerScreen } from './src/screens/SleepPlannerScreen';
import { GrowthTabScreen } from './src/screens/GrowthTabScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { AideScreen } from './src/screens/AideScreen';
import { ArticleDetailScreen } from './src/screens/ArticleDetailScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';

// Sheet components
import { BottomSheet, ReminderSheet, EditEventSheet } from './src/components/sheets';
import {
  SettingsHomeScreen,
  BabyProfileScreen,
  NotificationsScreen,
  ShareScreen,
  AppearanceScreen,
} from './src/screens/settings';

// Context Providers
import {
  BabyProvider,
  CaregiverProvider,
  SettingsProvider,
  EventsProvider,
  RemindersProvider,
  ToastProvider,
  useBaby,
  useCaregiver,
  useSettings,
  useEvents,
  useReminders,
} from './src/contexts';

// UI Components
import {
  Card,
  Divider,
  GradientTile,
  MiniMetric,
  EventRow,
  Chip,
  MiniBars,
  RowNav,
  ToggleRow,
  Loading,
} from './src/components/ui';

// ---------------- Icon Helper ----------------
// Helper component to use SF Symbols with similar API to Icon
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = "#000", ...props }) => {
  const iconMapping: Record<string, string> = {
    "moon-outline": "moon.fill",
    "cafe-outline": "drop.fill",
    "water-outline": "drop.fill",
    "time-outline": "clock",
    "chevron-forward": "chevron.right",
    "chevron-back": "chevron.left",
    "notifications-outline": "bell",
    "close": "xmark",
    "add": "plus",
    "remove": "minus",
    "stats-chart-outline": "chart.bar",
    "settings-outline": "gearshape",
    "person-outline": "person",
    "share-outline": "square.and.arrow.up",
    "color-palette-outline": "paintpalette",
    "create-outline": "plus",
    "calendar-outline": "calendar",
    "list-outline": "list.bullet",
    "home-outline": "house",
    "trending-up-outline": "chart.line.uptrend.xyaxis",
    "lightbulb-outline": "lightbulb",
    "sparkles-outline": "sparkles",
  };
  
  return <SFIcon name={iconMapping[name] || "questionmark.circle"} size={size} color={color} />;
};

// ---------------- Notifications config ----------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// ---------------- Theme ----------------
const THEME = {
  bg: "#FBF8F2",
  card: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#7A7A7A",
  line: "#ECECEC",
  green: "#2FB56A",
  primary: "#D48A63",  // Warm Terracotta

  purpleA: "#BCA7E6",
  purpleB: "#A98EE2",

  tealA: "#7ED1DD",
  tealB: "#56C0D0",

  yellowA: "#F3D27B",
  yellowB: "#EEC15F",

  iconBgPurple: "#EFE9FA",
  iconBgTeal: "#E5F6F9",
  iconBgYellow: "#FBF2DD",
};

// ---------------- Storage keys ----------------
const K_BABY = "bt_baby_v3";
const K_SETTINGS = "bt_settings_v3";
const K_EVENTS = "bt_events_v3";
const K_CAREGIVER = "bt_caregiver_v3";
const K_REMINDERS = "bt_reminders_v3";
const K_REMINDER_SETTINGS = "bt_reminder_settings_v3";

// ---------------- Defaults ----------------
const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const DEFAULT_SETTINGS = {
  defaultFeedingAmountMl: 120,
  defaultDiaperType: "pee", // pee | poo | mixed
};

const DEFAULT_CAREGIVER = {
  id: makeId(),
  name: "Parent",
  role: "parent",
};

const DEFAULT_REMINDER_SETTINGS = {
  pushEnabled: true,
  quietHoursEnabled: true,
  quietStartHour: 22,
  quietEndHour: 7,
  maxPerDay: 6,

  feedingGapEnabled: true,
  feedingGapMinutes: 180, // 3h
};

const MIN_MS = 60 * 1000;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

function diaperLabel(t) {
  if (t === "pee") return "Pipi";
  if (t === "poo") return "Caca";
  return "Mixte";
}

function isInQuietHours(date, quietStartHour, quietEndHour) {
  const h = date.getHours();
  if (quietStartHour === quietEndHour) return false;
  if (quietStartHour < quietEndHour) return h >= quietStartHour && h < quietEndHour;
  return h >= quietStartHour || h < quietEndHour;
}

function nextAllowedTimeMs(fireAtMs, quietStartHour, quietEndHour) {
  const d = new Date(fireAtMs);
  if (!isInQuietHours(d, quietStartHour, quietEndHour)) return fireAtMs;

  const candidate = new Date(fireAtMs);
  candidate.setHours(quietEndHour, 0, 0, 0);
  if (candidate.getTime() <= fireAtMs) candidate.setDate(candidate.getDate() + 1);
  return candidate.getTime();
}

function round1(x) {
  return Math.round(x * 10) / 10;
}

function msToHours(ms) {
  return ms / HOUR_MS;
}

function agoShort(fromMs, nowMs) {
  if (!fromMs) return "—";
  const diff = Math.max(0, nowMs - fromMs);
  const mins = Math.floor(diff / MIN_MS);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return m === 0 ? `${h}h` : `${h}h${m}`;
  const d = Math.floor(h / 24);
  const hr = h % 24;
  return hr === 0 ? `${d}j` : `${d}j${hr}h`;
}

function babyAgeLabel(birthISO) {
  if (!birthISO) return "";
  const birth = new Date(birthISO);
  const days = Math.max(0, differenceInDays(new Date(), birth));
  const months = Math.floor(days / 30.44);
  if (months <= 0) return `${days} jours`;
  return `${months} mois`;
}

function eventTitle(e) {
  if (e.type === "feeding") return `Repas • ${e.amountMl ?? "?"} ml`;
  if (e.type === "diaper") return `Couche • ${diaperLabel(e.diaperType)}`;
  if (e.type === "sleep") return e.endTs ? "Dodo • terminé" : "Dodo • en cours";
  return "Événement";
}

function eventIcon(e) {
  if (e.type === "sleep") return { name: "moon-outline", bg: THEME.iconBgPurple, color: "#7B61C9" };
  if (e.type === "feeding") return { name: "cafe-outline", bg: THEME.iconBgTeal, color: "#2AA7B8" };
  return { name: "water-outline", bg: THEME.iconBgYellow, color: "#D5A02F" };
}

function calcSleepTotalBetween(events, rangeStartMs, rangeEndMs) {
  let total = 0;
  for (const e of events) {
    if (e.type !== "sleep" || e.deletedAt) continue;
    const s = e.startTs ?? e.ts;
    const end = e.endTs ?? Date.now();
    if (end <= rangeStartMs) continue;
    if (s >= rangeEndMs) continue;
    const from = Math.max(s, rangeStartMs);
    const to = Math.min(end, rangeEndMs);
    total += Math.max(0, to - from);
  }
  return total;
}

function safeParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, error: "JSON invalide" };
  }
}

async function loadJson(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
async function saveJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// ---------------- UI building blocks ----------------
// ---------------- UI building blocks ----------------
// Card, Divider, GradientTile, MiniMetric, EventRow, Chip, MiniBars, RowNav, ToggleRow extracted to src/components/ui/

// BottomSheet extracted to src/components/sheets/BottomSheet.tsx

function Stepper({ value, onMinus, onPlus, suffix }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Pressable
        onPress={onMinus}
        style={({ pressed }) => ({
          width: 42,
          height: 42,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: THEME.line,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pressed ? "#F6F6F6" : "#fff",
        })}
      >
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>–</Text>
      </Pressable>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>
          {value}
          {suffix}
        </Text>
      </View>

      <Pressable
        onPress={onPlus}
        style={({ pressed }) => ({
          width: 42,
          height: 42,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: THEME.line,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pressed ? "#F6F6F6" : "#fff",
        })}
      >
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>+</Text>
      </Pressable>
    </View>
  );
}

function ActionToast({ toast, onUndo, onEdit, onClose }) {
  if (!toast?.visible) return null;
  const canEdit = toast.canEdit;
  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: Platform.OS === "ios" ? 88 : 70,
      }}
    >
      <View
        style={{
          backgroundColor: "#111",
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>{toast.title}</Text>
          {!!toast.subtitle && (
            <Text style={{ marginTop: 2, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              {toast.subtitle}
            </Text>
          )}
        </View>

        <Pressable onPress={onUndo} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <Text style={{ color: "#fff", fontWeight: "900" }}>Annuler</Text>
        </Pressable>

        <Text style={{ color: "rgba(255,255,255,0.25)" }}>•</Text>

        <Pressable
          onPress={canEdit ? onEdit : undefined}
          style={({ pressed }) => ({ opacity: canEdit ? (pressed ? 0.8 : 1) : 0.35 })}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Modifier</Text>
        </Pressable>

        <Pressable onPress={onClose} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, paddingLeft: 6 })}>
          <Icon name="close" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

// ---------------- Navigation ----------------
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const AideStack = createNativeStackNavigator();

// Custom Tab bar (design)
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: THEME.line,
        paddingBottom: Platform.OS === "ios" ? 18 : 10,
        paddingTop: 8,
        flexDirection: "row",
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconName = options.tabBarIconName;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              style={{
                width: 28,
                height: 3,
                borderRadius: 999,
                backgroundColor: isFocused ? THEME.primary : "transparent",
                marginBottom: 6,
              }}
            />
            <Icon name={iconName} size={22} color={isFocused ? THEME.primary : "#8F8F8F"} />
            <Text
              style={{
                marginTop: 4,
                fontSize: 11,
                fontWeight: isFocused ? "800" : "700",
                color: isFocused ? THEME.primary : "#8F8F8F",
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------- Screens ----------------
// OnboardingScreen extracted to src/screens/OnboardingScreen.tsx
// SleepPlannerScreen extracted to src/screens/SleepPlannerScreen.tsx

function SettingsStackScreen({ onImport }) {
  // Use context hooks instead of props
  const { baby, onUpdateBaby } = useBaby();
  const { reminderSettings, setReminderSettings } = useReminders();
  const { settings } = useSettings();
  const { caregiver } = useCaregiver();
  const { events } = useEvents();

  return (
    <SettingsStack.Navigator id="SettingsStack" screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsHome">
        {(navProps) => <SettingsHomeScreen {...navProps} />}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="BabyProfile">
        {(navProps) => <BabyProfileScreen {...navProps} />}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="Notifications">
        {(navProps) => <NotificationsScreen {...navProps} />}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="Share">
        {(navProps) => (
          <ShareScreen
            {...navProps}
            baby={baby}
            settings={settings}
            caregiver={caregiver}
            events={events}
            onImport={onImport}
          />
        )}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="Appearance" component={AppearanceScreen} />
    </SettingsStack.Navigator>
  );
}

// Aide Stack Navigator
function AideStackScreen() {
  return (
    <AideStack.Navigator id="AideStack" screenOptions={{ headerShown: false }}>
      <AideStack.Screen name="AideHome" component={AideScreen} />
      <AideStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    </AideStack.Navigator>
  );
}

// GrowthTabScreen extracted to src/screens/GrowthTabScreen.tsx

function TabsScreen({ nowMs }) {
  // Use context hooks instead of props
  const { baby, onUpdateBaby } = useBaby();
  const { events, onOpenEditEvent } = useEvents();
  const { setReminderSettings } = useReminders();
  
  // For onImport, we need access to App's onImport function
  // We'll pass it through a new context or keep it as a prop for now
  // Let's add it to the Settings context for data management
  
  const onImport = (text) => {
    const parsed = safeParseJson(text);
    if (!parsed.ok) {
      Alert.alert("Import impossible", parsed.error);
      return;
    }
    const data = parsed.value;
    if (!data || typeof data !== "object" || !Array.isArray(data.events)) {
      Alert.alert("Import impossible", "Format invalide (events manquants).");
      return;
    }

    Alert.alert("Importer ?", "Fusion des événements (déduplication par id).", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Importer",
        onPress: () => {
          if (!baby && data.baby) onUpdateBaby(data.baby);

          // Note: We'll need to add setEvents to events context
          // For now, this is a known limitation
          Alert.alert("Import OK", "Données fusionnées.");
        },
      },
    ]);
  };

  return (
    <Tab.Navigator id="MainTabs" tabBar={(p) => <CustomTabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Bébé" options={{ tabBarIconName: "home-outline" }}>
        {() => <HomeScreen nowMs={nowMs} />}
      </Tab.Screen>

      <Tab.Screen name="Aide" options={{ tabBarIconName: "lightbulb-outline" }}>
        {() => <AideStackScreen />}
      </Tab.Screen>

      <Tab.Screen name="Kumo" options={{ tabBarIconName: "sparkles-outline" }}>
        {() => <ChatScreen />}
      </Tab.Screen>

      <Tab.Screen name="Progrès" options={{ tabBarIconName: "list-outline" }}>
        {() => <MilestonesScreen baby={baby} />}
      </Tab.Screen>

      <Tab.Screen name="Suivi" options={{ tabBarIconName: "stats-chart-outline" }}>
        {() => <StatsScreen nowMs={nowMs} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ---------------- Reminder sheet (quick) ----------------
// ReminderSheet extracted to src/components/sheets/ReminderSheet.tsx

// ---------------- Edit Event sheet (Undo/Correction) ----------------
// EditEventSheet extracted to src/components/sheets/EditEventSheet.tsx

// ---------------- App (state + reminders + undo) ----------------
export default function App() {
  const [baby, setBaby] = useState(null);
  const [caregiver, setCaregiver] = useState(DEFAULT_CAREGIVER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [events, setEvents] = useState([]);

  const [reminderSettings, setReminderSettings] = useState(DEFAULT_REMINDER_SETTINGS);
  const [reminders, setReminders] = useState([]);

  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading screen timer (9 seconds to show full tagline animation)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // tick to refresh timers (“depuis le dernier…”, dodo en cours)
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 30 * 1000);
    return () => clearInterval(t);
  }, []);

  const remindersRef = useRef(reminders);
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  // quick reminder sheet
  const [sheetVisible, setSheetVisible] = useState(false);
  const sheetContextRef = useRef({ kind: null, baseTs: null, baseEventId: null });

  // diaper type selection sheet
  const [diaperSheetVisible, setDiaperSheetVisible] = useState(false);

  // toast undo/correction
  const [toast, setToast] = useState({ visible: false });
  const toastTimerRef = useRef(null);

  // edit sheet
  const [editVisible, setEditVisible] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const openEditEvent = (id) => {
    setEditEventId(id);
    setEditVisible(true);
  };

  const currentEditEvent = useMemo(() => {
    if (!editEventId) return null;
    return events.find((e) => e.id === editEventId) || null;
  }, [editEventId, events]);

  const closeToast = () => {
    setToast({ visible: false });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = null;
  };

  const showToastForEvent = (event, { undoKind }) => {
    if (!event?.id) return;
    const createdAt = Date.now();
    const canEditWindowMs = 10 * MIN_MS;

    const title =
      event.type === "feeding"
        ? `Repas ajouté`
        : event.type === "diaper"
        ? `Couche ajoutée`
        : event.endTs
        ? `Dodo terminé`
        : `Dodo démarré`;

    const subtitle =
      event.type === "feeding"
        ? `${event.amountMl ?? "?"} ml`
        : event.type === "diaper"
        ? diaperLabel(event.diaperType)
        : event.endTs
        ? `durée ~ ${agoShort(event.startTs ?? event.ts, event.endTs)}`
        : `depuis ${agoShort(event.startTs ?? event.ts, nowMs)}`;

    setToast({
      visible: true,
      title,
      subtitle,
      eventId: event.id,
      undoKind,
      createdAtMs: createdAt,
      canEditUntilMs: createdAt + canEditWindowMs,
    });

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      toastTimerRef.current = null;
    }, 9000);
  };

  const requestReminderSheet = (kind, baseTs, baseEventId) => {
    const allowed = ["feeding", "diaper", "sleep_stop"];
    if (!allowed.includes(kind)) return;
    sheetContextRef.current = { kind, baseTs, baseEventId };
    setSheetVisible(true);
  };

  const logFeeding = () => {
    if (!baby) return;
    const ts = Date.now();
    const e = {
      id: makeId(),
      babyId: baby.id,
      caregiverId: caregiver?.id ?? null,
      type: "feeding",
      ts,
      amountMl: settings.defaultFeedingAmountMl,
      diaperType: null,
      startTs: null,
      endTs: null,
      note: null,
      updatedAt: ts,
      deletedAt: null,
    };
    setEvents((prev) => [e, ...prev]);
    requestReminderSheet("feeding", ts, e.id);
    showToastForEvent(e, { undoKind: "delete_event" });
  };

  const logDiaper = () => {
    if (!baby) return;
    setDiaperSheetVisible(true);
  };

  const handleDiaperTypeSelect = (diaperType) => {
    if (!baby) return;
    const ts = Date.now();
    const e = {
      id: makeId(),
      babyId: baby.id,
      caregiverId: caregiver?.id ?? null,
      type: "diaper",
      ts,
      amountMl: null,
      diaperType,
      startTs: null,
      endTs: null,
      note: null,
      updatedAt: ts,
      deletedAt: null,
    };
    setEvents((prev) => [e, ...prev]);
    setDiaperSheetVisible(false);
    requestReminderSheet("diaper", ts, e.id);
    showToastForEvent(e, { undoKind: "delete_event" });
  };

  const startSleep = () => {
    if (!baby) return;
    const ts = Date.now();
    const e = {
      id: makeId(),
      babyId: baby.id,
      caregiverId: caregiver?.id ?? null,
      type: "sleep",
      ts,
      startTs: ts,
      endTs: null,
      amountMl: null,
      diaperType: null,
      note: null,
      updatedAt: ts,
      deletedAt: null,
    };
    setEvents((prev) => [e, ...prev]);
    showToastForEvent(e, { undoKind: "delete_event" });
  };

  const stopSleep = () => {
    const inProgressSleep = events.find((e) => e.type === "sleep" && !e.endTs && !e.deletedAt);
    if (!inProgressSleep) return;
    const ts = Date.now();
    setEvents((prev) =>
      prev.map((x) => (x.id === inProgressSleep.id ? { ...x, endTs: ts, updatedAt: ts } : x))
    );
    requestReminderSheet("sleep_stop", ts, inProgressSleep.id);
    showToastForEvent(
      { ...inProgressSleep, endTs: ts, updatedAt: ts },
      { undoKind: "reopen_sleep" }
    );
  };

  useEffect(() => {
    (async () => {
      const b = await loadJson(K_BABY, null);
      const cg = await loadJson(K_CAREGIVER, DEFAULT_CAREGIVER);
      const s = await loadJson(K_SETTINGS, DEFAULT_SETTINGS);
      const ev = await loadJson(K_EVENTS, []);
      const rs = await loadJson(K_REMINDER_SETTINGS, DEFAULT_REMINDER_SETTINGS);
      const rr = await loadJson(K_REMINDERS, []);
      setBaby(b);
      setCaregiver(cg);
      setSettings(s);
      setEvents(ev);
      setReminderSettings(rs);
      setReminders(rr);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_BABY, baby);
  }, [baby, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_CAREGIVER, caregiver);
  }, [caregiver, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_SETTINGS, settings);
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_EVENTS, events);
  }, [events, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_REMINDER_SETTINGS, reminderSettings);
  }, [reminderSettings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(K_REMINDERS, reminders);
  }, [reminders, hydrated]);

  const onCreateBaby = async (b) => {
    // Save initial measurements FIRST if provided
    if (b.initialWeight || b.initialHeight) {
      const childId = b.id;
      const measuredAt = b.birthDateISO;
      const measurements = [];
      
      if (b.initialWeight) {
        measurements.push({
          id: makeId(),
          childId,
          type: 'weight',
          value: b.initialWeight,
          measuredAt,
          source: 'parent',
          createdAt: new Date().toISOString(),
        });
      }
      
      if (b.initialHeight) {
        measurements.push({
          id: makeId(),
          childId,
          type: 'length',
          value: b.initialHeight,
          measuredAt,
          source: 'parent',
          createdAt: new Date().toISOString(),
        });
      }
      
      // Save measurements to AsyncStorage with correct key format
      try {
        const storageKey = `growth_measurements_${childId}`;
        const existingData = await AsyncStorage.getItem(storageKey);
        const existing = existingData ? JSON.parse(existingData) : [];
        await AsyncStorage.setItem(storageKey, JSON.stringify([...existing, ...measurements]));
        console.log('[Onboarding] Initial measurements saved:', measurements.length);
        // Small delay to ensure persistence
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error saving initial measurements:', error);
      }
    }
    
    // THEN set the baby (triggers UI update)
    setBaby(b);
  };
  const onUpdateBaby = (b) => setBaby(b);

  const ensurePushPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  };

  const countRemindersForToday = (arr) => {
    const start = startOfDay(new Date()).getTime();
    const end = start + DAY_MS;
    return arr.filter((r) => !r.cancelledAt && r.fireAtMs >= start && r.fireAtMs < end).length;
  };

  const scheduleOneReminder = async ({ kind, title, body, fireAtMs, auto = false }) => {
    const current = remindersRef.current || [];
    const todayCount = countRemindersForToday(current);
    if (todayCount >= reminderSettings.maxPerDay) return null;

    let finalFireAtMs = fireAtMs;
    if (reminderSettings.quietHoursEnabled) {
      finalFireAtMs = nextAllowedTimeMs(
        fireAtMs,
        reminderSettings.quietStartHour,
        reminderSettings.quietEndHour
      );
    }

    let notificationId = null;
    if (reminderSettings.pushEnabled) {
      const ok = await ensurePushPermission();
      if (ok) {
        try {
          const seconds = Math.max(5, Math.round((finalFireAtMs - Date.now()) / 1000));
          notificationId = await Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: { seconds },
          });
        } catch {
          notificationId = null;
        }
      }
    }

    const r = {
      id: makeId(),
      kind,
      title,
      body,
      auto,
      createdAtMs: Date.now(),
      fireAtMs: finalFireAtMs,
      notificationId,
      cancelledAt: null,
    };

    setReminders((prev) => [r, ...prev]);
    return r;
  };

  const cancelReminder = async (reminderId) => {
    const r = remindersRef.current.find((x) => x.id === reminderId);
    if (!r) return;
    if (r.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(r.notificationId);
      } catch (err) {
        // eslint(no-empty): ensure this catch is not considered an empty block
        void err;
      }
    }
    const ts = Date.now();
    setReminders((prev) => prev.map((x) => (x.id === reminderId ? { ...x, cancelledAt: ts } : x)));
  };

  const scheduleReminderFromSheet = async ({ kind, minutes }) => {
    if (!baby) return;

    const baseTs = sheetContextRef.current.baseTs ?? Date.now();
    const fireAtMs = baseTs + minutes * MIN_MS;

    const map = {
      feeding: { title: `Rappel repas (${baby.name})`, body: "Tu veux enregistrer un repas ?" },
      diaper: { title: `Rappel couche (${baby.name})`, body: "Tu veux enregistrer une couche ?" },
      sleep_stop: { title: `Rappel dodo (${baby.name})`, body: "Check rapide : prochaine sieste / coucher ?" },
    };

    const content = map[kind] ?? { title: `Rappel (${baby.name})`, body: "Check rapide" };

    const r = await scheduleOneReminder({
      kind,
      title: content.title,
      body: content.body,
      fireAtMs,
      auto: false,
    });

    setSheetVisible(false);

    if (!r) {
      Alert.alert("Rappel non créé", "Limite atteinte (ou notifications indisponibles).");
      return;
    }
    Alert.alert("Rappel créé", `À ${format(new Date(r.fireAtMs), "HH:mm", { locale: fr })}`);
  };

  // ✅ AUTO reminder: pas de biberon depuis X
  const reconcileFeedingGapReminder = async () => {
    if (!baby) return;

    const current = remindersRef.current || [];
    const activeGap = current.find((r) => r.kind === "feeding_gap" && !r.cancelledAt);

    if (!reminderSettings.feedingGapEnabled) {
      if (activeGap) await cancelReminder(activeGap.id);
      return;
    }

    const lastFeed = [...events]
      .filter((e) => !e.deletedAt && e.type === "feeding" && e.babyId === baby.id)
      .sort((a, b) => b.ts - a.ts)[0];

    if (!lastFeed) {
      if (activeGap) await cancelReminder(activeGap.id);
      return;
    }

    const targetAtMs = lastFeed.ts + reminderSettings.feedingGapMinutes * MIN_MS;
    const desiredAtMs = Math.max(Date.now() + 5 * 1000, targetAtMs);

    if (activeGap && Math.abs(activeGap.fireAtMs - desiredAtMs) < 5 * MIN_MS) return;

    if (activeGap) await cancelReminder(activeGap.id);

    await scheduleOneReminder({
      kind: "feeding_gap",
      title: `Repas ? (${baby.name})`,
      body: `Pas de repas depuis ${round1(reminderSettings.feedingGapMinutes / 60)}h.`,
      fireAtMs: desiredAtMs,
      auto: true,
    });
  };

  useEffect(() => {
    if (!hydrated) return;
    reconcileFeedingGapReminder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hydrated,
    baby?.id,
    events,
    reminderSettings.feedingGapEnabled,
    reminderSettings.feedingGapMinutes,
    reminderSettings.pushEnabled,
    reminderSettings.quietHoursEnabled,
    reminderSettings.quietStartHour,
    reminderSettings.quietEndHour,
    reminderSettings.maxPerDay,
  ]);

  // Import share data
  const onImport = (text) => {
    const parsed = safeParseJson(text);
    if (!parsed.ok) {
      Alert.alert("Import impossible", parsed.error);
      return;
    }
    const data = parsed.value;
    if (!data || typeof data !== "object" || !Array.isArray(data.events)) {
      Alert.alert("Import impossible", "Format invalide (events manquants).");
      return;
    }

    Alert.alert("Importer ?", "Fusion des événements (déduplication par id).", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Importer",
        onPress: () => {
          if (!baby && data.baby) setBaby(data.baby);

          setEvents((prev) => {
            const existing = new Set(prev.map((e) => e.id));
            const incoming = (data.events || []).filter((e) => e && e.id && !existing.has(e.id));
            return [...incoming, ...prev];
          });

          Alert.alert("Import OK", "Données fusionnées.");
        },
      },
    ]);
  };

  // ---------------- Undo actions ----------------
  const undoToastAction = () => {
    if (!toast?.eventId) return;
    const eventId = toast.eventId;

    if (toast.undoKind === "delete_event") {
      const ts = Date.now();
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, deletedAt: ts, updatedAt: ts } : e)));
      closeToast();
      return;
    }

    if (toast.undoKind === "reopen_sleep") {
      const ts = Date.now();
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, endTs: null, updatedAt: ts } : e)));
      closeToast();
      return;
    }
  };

  const editToastAction = () => {
    if (!toast?.eventId) return;
    openEditEvent(toast.eventId);
    closeToast();
  };

  // edit sheet save/delete
  const saveEvent = (updated) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id) => {
    const ts = Date.now();
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, deletedAt: ts, updatedAt: ts } : e)));
    setEditVisible(false);
  };

  const stopSleepNowFromEdit = () => {
    if (!currentEditEvent || currentEditEvent.type !== "sleep") return;
    const ts = Date.now();
    saveEvent({ ...currentEditEvent, endTs: ts, updatedAt: ts });
    setEditVisible(false);
  };

  if (!hydrated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg, padding: 16 }}>
        <Text style={{ color: THEME.muted }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  const canEdit = toast?.visible && nowMs <= (toast?.canEditUntilMs ?? 0);

  // Prepare context values
  const babyContextValue = {
    baby,
    setBaby,
    onCreateBaby,
    onUpdateBaby,
  };

  const caregiverContextValue = {
    caregiver,
    setCaregiver,
  };

  const settingsContextValue = {
    settings,
    setSettings,
  };

  const eventsContextValue = {
    events,
    setEvents,
    logFeeding,
    logDiaper,
    startSleep,
    stopSleep,
    updateEvent: saveEvent,
    deleteEvent,
    onOpenEditEvent: openEditEvent,
  };

  const remindersContextValue = {
    reminders,
    setReminders,
    reminderSettings,
    setReminderSettings,
    requestReminderSheet,
    ensurePushPermission,
  };

  const toastContextValue = {
    toast,
    showToastForEvent,
    closeToast,
    undoAction: undoToastAction,
  };

  // Show loading screen while hydrating data
  if (!hydrated) {
    return <Loading message="Chargement de vos données..." fullScreen />;
  }

  // Show initial loading screen with logo
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <BabyProvider value={babyContextValue}>
        <CaregiverProvider value={caregiverContextValue}>
          <SettingsProvider value={settingsContextValue}>
            <EventsProvider value={eventsContextValue}>
              <RemindersProvider value={remindersContextValue}>
                <ToastProvider value={toastContextValue}>
                  <NavigationContainer>
                    <RootStack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                    {!baby ? (
                      <RootStack.Screen name="Onboarding">
                        {() => <OnboardingScreen />}
                      </RootStack.Screen>
                    ) : (
                      <RootStack.Screen name="Tabs">
                        {() => (
                          <>
                            <TabsScreen nowMs={nowMs} />

                            <ReminderSheet
                              visible={sheetVisible}
                              title="Créer un rappel"
                              onPickMinutes={(m) =>
                                scheduleReminderFromSheet({
                                  kind: sheetContextRef.current.kind,
                                  minutes: m,
                                })
                              }
                              onClose={() => setSheetVisible(false)}
                            />

                            <EditEventSheet
                              visible={editVisible}
                              event={currentEditEvent}
                              nowMs={nowMs}
                              onClose={() => setEditVisible(false)}
                              onSave={saveEvent}
                              onDelete={() => deleteEvent(currentEditEvent?.id)}
                              onStopSleepNow={stopSleepNowFromEdit}
                            />

                            <BottomSheet visible={diaperSheetVisible} onClose={() => setDiaperSheetVisible(false)}>
                              <Text style={{ fontWeight: "900", fontSize: 16, color: THEME.text }}>
                                Type de couche
                              </Text>

                              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 16, gap: 10 }}>
                                <Pressable
                                  onPress={() => handleDiaperTypeSelect("pee")}
                                  style={({ pressed }) => ({
                                    flex: 1,
                                    minWidth: "45%",
                                    paddingVertical: 20,
                                    borderRadius: 18,
                                    backgroundColor: pressed ? "#E8F5E9" : "#F1F8F4",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  })}
                                >
                                  <Text style={{ fontSize: 40, marginBottom: 8 }}>💧</Text>
                                  <Text style={{ fontWeight: "900", fontSize: 14, color: THEME.text }}>Mouillée</Text>
                                </Pressable>

                                <Pressable
                                  onPress={() => handleDiaperTypeSelect("poo")}
                                  style={({ pressed }) => ({
                                    flex: 1,
                                    minWidth: "45%",
                                    paddingVertical: 20,
                                    borderRadius: 18,
                                    backgroundColor: pressed ? "#FFF3E0" : "#FFF8F0",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  })}
                                >
                                  <Text style={{ fontSize: 40, marginBottom: 8 }}>💩</Text>
                                  <Text style={{ fontWeight: "900", fontSize: 14, color: THEME.text }}>Souillée</Text>
                                </Pressable>

                                <Pressable
                                  onPress={() => handleDiaperTypeSelect("mixed")}
                                  style={({ pressed }) => ({
                                    flex: 1,
                                    minWidth: "45%",
                                    paddingVertical: 20,
                                    borderRadius: 18,
                                    backgroundColor: pressed ? "#E3F2FD" : "#F0F7FF",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  })}
                                >
                                  <Text style={{ fontSize: 40, marginBottom: 8 }}>💧💩</Text>
                                  <Text style={{ fontWeight: "900", fontSize: 14, color: THEME.text }}>Les deux</Text>
                                </Pressable>
                              </View>

                              <Pressable
                                onPress={() => setDiaperSheetVisible(false)}
                                style={({ pressed }) => ({
                                  marginTop: 20,
                                  paddingVertical: 14,
                                  borderRadius: 18,
                                  borderWidth: 1,
                                  borderColor: THEME.line,
                                  backgroundColor: pressed ? "#F6F6F6" : "#fff",
                                })}
                              >
                                <Text style={{ textAlign: "center", fontWeight: "900", color: THEME.text }}>Annuler</Text>
                              </Pressable>
                            </BottomSheet>

                            <ActionToast
                              toast={{ ...toast, canEdit }}
                              onUndo={undoToastAction}
                              onEdit={editToastAction}
                              onClose={closeToast}
                            />
                          </>
                        )}
                      </RootStack.Screen>
                    )}
                      <RootStack.Screen name="Settings">
                        {() => (
                          <SettingsStackScreen
                            onImport={(text) => {
                              const parsed = safeParseJson(text);
                              if (!parsed.ok) {
                                Alert.alert("Import impossible", parsed.error);
                                return;
                              }
                              const data = parsed.value;
                              if (!data || typeof data !== "object" || !Array.isArray(data.events)) {
                                Alert.alert("Import impossible", "Format invalide (events manquants).");
                                return;
                              }
                              Alert.alert("Importer ?", "Fusion des événements (déduplication par id).", [
                                { text: "Annuler", style: "cancel" },
                                {
                                  text: "Importer",
                                  onPress: () => {
                                    if (!baby && data.baby) setBaby(data.baby);
                                    Alert.alert("Import OK", "Données fusionnées.");
                                  },
                                },
                              ]);
                            }}
                          />
                        )}
                      </RootStack.Screen>
                  </RootStack.Navigator>
                </NavigationContainer>
              </ToastProvider>
            </RemindersProvider>
          </EventsProvider>
        </SettingsProvider>
      </CaregiverProvider>
    </BabyProvider>
    </SafeAreaProvider>
  );
}


// src/screens/MilestonesScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  SectionList,
  Share,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';
import { MILESTONE_GROUPS, getAllMilestones } from "../data/milestones_0_12";
import { HeroBadge } from "../components/ui/HeroBadge";
import { AnimatedCheckbox } from "../components/ui/AnimatedCheckbox";
import { ScreenHeader } from "../components/ui";
import { SFIcon } from "../components/SFIcon";

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

const STORAGE_KEY = "milestones_checked_v1";

interface CheckedState {
  [id: string]: {
    done: boolean;
    doneAt: string;
  };
}

function pct(done: number, total: number): number {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

export default function MilestonesScreen() {
  const [checked, setChecked] = useState<CheckedState>({}); // { [id]: { done: true, doneAt: ISO } }
  const [monthFilter, setMonthFilter] = useState("0-2"); // Default to first 2-month range
  const [query, setQuery] = useState("");

  // Load
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setChecked(JSON.parse(raw));
      } catch (e) {
        // ignore silently (optional: console.warn)
      }
    })();
  }, []);

  // Save (simple, no debounce)
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
      } catch (e) {
        // ignore
      }
    })();
  }, [checked]);

  const all = useMemo(() => getAllMilestones(), []);
  const totalCount = all.length;
  const doneCount = useMemo(
    () => all.reduce((acc, it) => acc + (checked[it.id]?.done ? 1 : 0), 0),
    [all, checked]
  );

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Map 2-month ranges to their constituent group keys
    const rangeToGroups: Record<string, string[]> = {
      "0-2": ["0-1", "2"],
      "3-4": ["3", "4"],
      "5-6": ["5", "6"],
      "7-8": ["7", "8"],
      "9-10": ["9", "10"],
      "11-12": ["11", "12"],
    };
    
    const groupKeys = rangeToGroups[monthFilter] || [];
    const base = MILESTONE_GROUPS.filter(g => groupKeys.includes(g.key));

    return base
      .map(g => {
        const data = g.items.filter(it => {
          if (!q) return true;
          return (
            it.label.toLowerCase().includes(q) ||
            (it.hint || "").toLowerCase().includes(q)
          );
        });
        return { ...g, data };
      })
      .filter(sec => sec.data.length > 0);
  }, [monthFilter, query]);

  const toggle = (id: string) => {
    setChecked(prev => {
      const cur = prev[id]?.done === true;
      if (cur) {
        // uncheck
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const next = { ...prev };
        delete next[id];
        return next;
      }
      // check - succès avec feedback plus fort
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { ...prev, [id]: { done: true, doneAt: new Date().toISOString() } };
    });
  };

  const shareProgress = async () => {
    const percent = pct(doneCount, totalCount);
    const message =
      `Développement 0–12 mois : ${doneCount}/${totalCount} (${percent}%).\n` +
      `Détails dans l'app (checklist).`;
    try {
      await Share.share({ message });
    } catch (e) {}
  };

  const monthChips = useMemo(() => ([
    { key: "0-2", title: "0-2 mois" },
    { key: "3-4", title: "3-4 mois" },
    { key: "5-6", title: "5-6 mois" },
    { key: "7-8", title: "7-8 mois" },
    { key: "9-10", title: "9-10 mois" },
    { key: "11-12", title: "11-12 mois" },
  ]), []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F1EC" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with settings button */}
        <ScreenHeader showLogo />
        
        {/* Content Header */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: "#4B3F39", marginBottom: 16 }}>
            Développement 0–12 mois
          </Text>

          {/* Month chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {monthChips.map((chip, index) => {
              const active = monthFilter === chip.key;
              return (
                <HeroBadge
                  key={chip.key}
                  text={chip.title}
                  icon={
                    <SFIcon
                      name="calendar"
                      size={16}
                      color={active ? '#FBF8F6' : THEME.primary}
                    />
                  }
                  variant={active ? 'default' : 'outline'}
                  size="md"
                  onPress={() => setMonthFilter(chip.key)}
                  animated={index === 0}
                  style={{
                    backgroundColor: active ? THEME.primary : THEME.card,
                    borderColor: active ? THEME.primary : THEME.line,
                  }}
                  textStyle={{
                    color: active ? '#FBF8F6' : THEME.primary,
                  }}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* List */}
        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          renderSectionHeader={({ section }) => {
            const secTotal = section.data.length;
            const secDone = section.data.reduce((acc, it) => acc + (checked[it.id]?.done ? 1 : 0), 0);
            return (
              <View style={{ marginTop: 16, marginBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Text style={{ color: "#3A3A3A", fontSize: 18, fontWeight: "800" }}>{section.title}</Text>
                  <Text style={{ color: "#8A8A8A" }}>{secDone}/{secTotal}</Text>
                </View>
                <View style={{ height: 8, borderRadius: 999, backgroundColor: "#E8D5C4", marginTop: 8, overflow: "hidden" }}>
                  <View style={{ width: `${pct(secDone, secTotal)}%`, height: "100%", backgroundColor: "#D48A63" }} />
                </View>
              </View>
            );
          }}
          renderItem={({ item }) => {
            const done = checked[item.id]?.done === true;
            const doneAt = checked[item.id]?.doneAt;
            return (
              <Pressable
                onPress={() => toggle(item.id)}
                style={{
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: "#FBF8F6",
                  marginBottom: 10,
                  flexDirection: "row",
                  gap: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                {/* Animated Checkbox */}
                <AnimatedCheckbox
                  checked={done}
                  onPress={() => toggle(item.id)}
                  size={24}
                />

                {/* Content */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#3A3A3A", fontWeight: "800" }}>
                    {item.label}
                  </Text>
                  {!!item.hint && (
                    <Text style={{ marginTop: 4, color: "#8A8A8A" }}>
                      {item.hint}
                    </Text>
                  )}
                  {doneAt ? (
                    <Text style={{ marginTop: 6, color: "#8A8A8A", fontSize: 12 }}>
                      Observé le {new Date(doneAt).toLocaleDateString("fr-FR")}
                    </Text>
                  ) : null}
                </View>

                {/* Status */}
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ color: done ? "#D48A63" : "#8A8A8A", fontWeight: "700", fontSize: 12 }}>
                    {done ? "Observé" : "Ça arrive 😊"}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

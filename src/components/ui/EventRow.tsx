import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const THEME = {
  text: "#4B3F39",
  muted: "#7A6A60",
  iconBgSleep: "#E8D5C4",
  iconBgFeed: "#F4E6D9",
  iconBgDiaper: "#F5E8D8",
  iconSleep: "#A88B73",
  iconFeed: "#E6A77D",
  iconDiaper: "#E3B58F",
};

// Icon helper
const Icon = ({ name, size = 24, color = THEME.text }: any) => {
  return <Text style={{ fontSize: size, color }}>⚡</Text>;
};

function diaperLabel(type: string) {
  if (type === "wet") return "💧 Pipi";
  if (type === "dirty") return "💩 Caca";
  return "💧💩 Mixte";
}

function eventTitle(e: any) {
  if (e.type === "feeding") return `Repas • ${e.amountMl ?? "?"} ml`;
  if (e.type === "diaper") return `Couche • ${diaperLabel(e.diaperType)}`;
  if (e.type === "sleep") return e.endTs ? "Dodo • terminé" : "Dodo • en cours";
  return "Événement";
}

function eventIcon(e: any) {
  if (e.type === "sleep") return { name: "moon-outline", bg: THEME.iconBgSleep, color: THEME.iconSleep };
  if (e.type === "feeding") return { name: "cafe-outline", bg: THEME.iconBgFeed, color: THEME.iconFeed };
  return { name: "water-outline", bg: THEME.iconBgDiaper, color: THEME.iconDiaper };
}

interface EventRowProps {
  e: any;
  onPress: () => void;
}

export function EventRow({ e, onPress }: EventRowProps) {
  const ico = eventIcon(e);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 14,
          backgroundColor: ico.bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon name={ico.name} size={18} color={ico.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800", color: THEME.text }}>{eventTitle(e)}</Text>
        <Text style={{ marginTop: 4, fontSize: 12, color: THEME.muted }}>
          {format(new Date(e.ts), "EEEE dd MMM • HH:mm", { locale: fr })}
        </Text>
      </View>

      <Icon name="chevron-forward" size={18} color={THEME.muted} />
    </Pressable>
  );
}

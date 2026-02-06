import React, { useMemo, memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { THEME } from "../constants/theme";
import { eventTitle, eventIcon } from "../utils/eventUtils";
import { Event } from "../types";

/**
 * EventRow Component
 * 
 * Displays a single event in a list with icon, title, timestamp, and chevron.
 * Tappable to view event details.
 * Memoized to prevent unnecessary re-renders in lists.
 * 
 * @param {Object} props
 * @param {Object} props.e - Event object to display
 * @param {Function} props.onPress - Callback when row is pressed
 */
export const EventRow = memo(function EventRow({ e, onPress }: {
  e: Event;
  onPress: () => void;
}) {
  const ico = useMemo(() => eventIcon(e), [e]);
  const title = useMemo(() => eventTitle(e), [e]);
  const timestamp = useMemo(
    () => format(new Date(e.ts), "EEEE dd MMM • HH:mm", { locale: fr }),
    [e.ts]
  );
  
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
      {/* Icon */}
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
        <Ionicons name={ico.name} size={18} color={ico.color} />
      </View>

      {/* Title and timestamp */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800", color: THEME.text }}>
          {title}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 12, color: THEME.muted }}>
          {timestamp}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color="#C9C9C9" />
    </Pressable>
  );
});

import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../constants/theme";

/**
 * EmptyState Component
 * 
 * Displays a friendly "no data" message when there are no events to show.
 * Includes an icon and instructional text.
 * Memoized as it rarely changes.
 */
export const EmptyState = memo(function EmptyState() {
  return (
    <View style={{ alignItems: "center", paddingVertical: 26 }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: "#EEF2EE",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="time-outline" size={26} color="#6E7A6E" />
      </View>
      <Text
        style={{
          marginTop: 10,
          fontWeight: "900",
          color: THEME.muted,
        }}
      >
        Aucun événement
      </Text>
      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "#9A9A9A",
          textAlign: "center",
        }}
      >
        Utilise les boutons pour noter un événement
      </Text>
    </View>
  );
});

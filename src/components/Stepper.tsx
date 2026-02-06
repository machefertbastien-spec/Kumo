import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { THEME } from "../constants/theme";

/**
 * Stepper Component
 * 
 * A numeric control with minus and plus buttons.
 * Used for adjusting values like feeding amounts or time intervals.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {number} props.value - Current numeric value
 * @param {Function} props.onMinus - Callback when minus button pressed
 * @param {Function} props.onPlus - Callback when plus button pressed
 * @param {string} props.suffix - Optional suffix to display after value (e.g., "ml")
 */
export const Stepper = memo(function Stepper({ value, onMinus, onPlus, suffix }: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  suffix?: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      {/* Minus Button */}
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
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>
          –
        </Text>
      </Pressable>

      {/* Value Display */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>
          {value}
          {suffix}
        </Text>
      </View>

      {/* Plus Button */}
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
        <Text style={{ fontSize: 18, fontWeight: "900", color: THEME.text }}>
          +
        </Text>
      </Pressable>
    </View>
  );
});

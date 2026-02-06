import React, { memo } from "react";
import { Pressable, Text } from "react-native";
import { THEME } from "../constants/theme";

/**
 * Chip Component
 * 
 * A pill-shaped button that can be active or inactive.
 * Used for filters and selection options.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {string} props.label - Text to display on the chip
 * @param {boolean} props.active - Whether the chip is in active state
 * @param {Function} props.onPress - Callback when chip is pressed
 */
export const Chip = memo(function Chip({ label, active, onPress }: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: active ? THEME.green : THEME.line,
        backgroundColor: active ? "#EAF8F1" : "#FBF8F6",
        opacity: pressed ? 0.85 : 1,
        marginRight: 8,
        marginBottom: 8,
      })}
    >
      <Text
        style={{
          fontWeight: "800",
          color: active ? THEME.green : THEME.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
});

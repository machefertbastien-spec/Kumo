import React from 'react';
import { Text, Pressable } from 'react-native';

const THEME = {
  primary: "#D48A63",
  line: "#EFE7E1",
  card: "#FBF8F6",
  text: "#4B3F39",
  muted: "#7A6A60",
};

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: active ? THEME.primary : THEME.line,
        backgroundColor: active ? "#F5E5D8" : THEME.card,
        opacity: pressed ? 0.85 : 1,
        marginRight: 8,
        marginBottom: 8,
      })}
    >
      <Text style={{ fontWeight: "800", fontSize: 12, color: active ? THEME.primary : THEME.muted }}>
        {label}
      </Text>
    </Pressable>
  );
}

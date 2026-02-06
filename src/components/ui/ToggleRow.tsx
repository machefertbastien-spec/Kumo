import React from 'react';
import { View, Text, Switch } from 'react-native';

const THEME = {
  text: "#4B3F39",
  muted: "#7A6A60",
};

interface ToggleRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function ToggleRow({ title, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontWeight: "800", color: THEME.text }}>{title}</Text>
        {!!subtitle && <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>{subtitle}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

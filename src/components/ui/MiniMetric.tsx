import React from 'react';
import { View, Text } from 'react-native';

const THEME = {
  text: "#1A1A1A",
  muted: "#7A7A7A",
};

// Icon helper
const Icon = ({ name, size = 24, color = "#4B3F39" }: any) => {
  return <Text style={{ fontSize: size, color }}>⚡</Text>;
};

interface MiniMetricProps {
  iconName: string;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
}

export function MiniMetric({ iconName, iconBg, iconColor, value, label }: MiniMetricProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          backgroundColor: iconBg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={{ marginTop: 8, fontSize: 18, fontWeight: "900", color: THEME.text }}>
        {value}
      </Text>
      <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>{label}</Text>
    </View>
  );
}

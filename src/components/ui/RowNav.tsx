import React from 'react';
import { View, Text, Pressable } from 'react-native';

const THEME = {
  text: "#4B3F39",
  muted: "#7A6A60",
  iconBg: "#EFE7E1",
};

// Icon helper
const Icon = ({ name, size = 24, color = THEME.text }: any) => {
  return <Text style={{ fontSize: size, color }}>⚡</Text>;
};

interface RowNavProps {
  iconName: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export function RowNav({ iconName, title, subtitle, onPress }: RowNavProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: THEME.iconBg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon name={iconName} size={18} color={THEME.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800", color: THEME.text }}>{title}</Text>
        {!!subtitle && <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-forward" size={18} color={THEME.muted} />
    </Pressable>
  );
}

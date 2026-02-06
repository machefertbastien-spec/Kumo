import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../constants/theme";

/**
 * MiniMetric Component
 * 
 * Displays a small statistic with an icon, value, and label.
 * Used in dashboard views to show key metrics.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {string} props.iconName - Ionicons icon name
 * @param {string} props.iconBg - Background color for icon container
 * @param {string} props.iconColor - Icon color
 * @param {string|number} props.value - Metric value to display
 * @param {string} props.label - Descriptive label below value
 */
export const MiniMetric = memo(function MiniMetric({ iconName, iconBg, iconColor, value, label }: {
  iconName: any;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
}) {
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
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <Text
        style={{
          marginTop: 8,
          fontSize: 18,
          fontWeight: "900",
          color: THEME.text,
        }}
      >
        {value}
      </Text>
      <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>
        {label}
      </Text>
    </View>
  );
});

import React, { memo } from "react";
import { View, ViewStyle } from "react-native";
import { THEME } from "../constants/theme";

/**
 * Divider Component
 * 
 * A simple horizontal line used to separate content sections.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {Object} props.style - Additional styles to apply
 */
export const Divider = memo(function Divider({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[
        { height: 1, backgroundColor: THEME.line },
        style,
      ]}
    />
  );
});

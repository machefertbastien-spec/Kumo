import React, { memo } from "react";
import { View, ViewStyle } from "react-native";
import { THEME } from "../constants/theme";

/**
 * Card Component
 * 
 * A reusable elevated white container with rounded corners and shadow.
 * Used throughout the app for grouping related content.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {Object} props.style - Additional styles to apply
 */
export const Card = memo(function Card({ children, style }: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: THEME.card,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: THEME.line,
          shadowColor: "#4B3F39",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
});

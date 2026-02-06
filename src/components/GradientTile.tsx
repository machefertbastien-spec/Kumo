import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * GradientTile Component (now solid color)
 * 
 * A large, tappable tile with a solid background, icon, and label.
 * Used for primary quick-action buttons on the home screen.
 * Memoized to prevent unnecessary re-renders.
 * 
 * Updated to Kumo Design System v1.0 - no gradients, solid colors only
 * 
 * @param {Object} props
 * @param {string} props.title - Button title text
 * @param {string} props.iconName - Ionicons icon name
 * @param {string} props.color - Single background color (no gradient)
 * @param {Function} props.onPress - Callback when button is pressed
 */
export const GradientTile = memo(function GradientTile({ title, iconName, color, onPress }: {
  title: string;
  iconName: any;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        { flex: 1 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View
        style={{
          backgroundColor: color,
          height: 84,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }}
      >
        <Ionicons name={iconName} size={22} color="#FBF8F6" />
        <Text style={{ marginTop: 8, color: "#FBF8F6", fontWeight: "800" }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
});

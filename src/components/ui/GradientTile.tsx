import React from 'react';
import { Text, Pressable, View } from 'react-native';

// Icon helper
const Icon = ({ name, size = 24, color = "#FBF8F6" }: any) => {
  return <Text style={{ fontSize: size, color }}>⚡</Text>;
};

interface GradientTileProps {
  title: string;
  iconName: string;
  color: string;
  onPress: () => void;
}

export function GradientTile({ title, iconName, color, onPress }: GradientTileProps) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
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
        <Icon name={iconName} size={22} color="#FBF8F6" />
        <Text style={{ marginTop: 8, color: "#FBF8F6", fontWeight: "800" }}>{title}</Text>
      </View>
    </Pressable>
  );
}

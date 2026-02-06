import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

const THEME = {
  card: "#FBF8F6",
  line: "#EFE7E1",
  text: "#4B3F39",
};

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: THEME.card,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: THEME.line,
          shadowColor: THEME.text,
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
}

import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
};

// Card Component
const Card = ({ children, style }: any) => (
  <View
    style={[
      {
        backgroundColor: THEME.card,
        borderRadius: 20,
        padding: 16,
        shadowColor: THEME.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export function AppearanceScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text }}>Apparence</Text>
      </View>
    </SafeAreaView>
  );
}

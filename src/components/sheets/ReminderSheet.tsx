import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '../ui';

const THEME = {
  text: "#4B3F39",
  muted: "#7A6A60",
  line: "#EFE7E1",
  card: "#FBF8F6",
};

interface ReminderSheetProps {
  visible: boolean;
  title: string;
  onPickMinutes: (minutes: number) => void;
  onClose: () => void;
}

export function ReminderSheet({ visible, title, onPickMinutes, onClose }: ReminderSheetProps) {
  if (!visible) return null;
  
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: THEME.card,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        borderWidth: 1,
        borderColor: THEME.line,
        padding: 14,
      }}
    >
      <Text style={{ fontWeight: "900", fontSize: 16, color: THEME.text }}>{title}</Text>
      <Text style={{ marginTop: 6, color: THEME.muted }}>Choisis un rappel rapide (push si activé).</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
        <Chip label="20 min" active={false} onPress={() => onPickMinutes(20)} />
        <Chip label="40 min" active={false} onPress={() => onPickMinutes(40)} />
        <Chip label="60 min" active={false} onPress={() => onPickMinutes(60)} />
        <Chip label="90 min" active={false} onPress={() => onPickMinutes(90)} />
      </View>

      <Pressable
        onPress={onClose}
        style={({ pressed }) => ({
          marginTop: 6,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: THEME.line,
          backgroundColor: pressed ? "#EFE7E1" : THEME.card,
        })}
      >
        <Text style={{ textAlign: "center", fontWeight: "900", color: THEME.text }}>Fermer</Text>
      </Pressable>

      <SafeAreaView />
    </View>
  );
}

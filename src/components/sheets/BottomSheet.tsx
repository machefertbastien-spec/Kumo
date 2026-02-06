import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
  line: "#EFE7E1",
  card: "#FBF8F6",
};

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  if (!visible) return null;
  
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: "flex-end",
      }}
    >
      <Pressable
        testID="backdrop"
        onPress={onClose}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />
      <View
        style={{
          backgroundColor: THEME.card,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderWidth: 1,
          borderColor: THEME.line,
          padding: 14,
        }}
      >
        {children}
        <SafeAreaView />
      </View>
    </View>
  );
}

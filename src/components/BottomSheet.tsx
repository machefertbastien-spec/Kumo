import React, { memo } from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from "../constants/theme";

/**
 * BottomSheet Component
 * 
 * A modal that slides up from the bottom of the screen.
 * Includes a dimmed backdrop that can be tapped to close.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether the sheet is visible
 * @param {Function} props.onClose - Callback when sheet should close
 * @param {React.ReactNode} props.children - Content to display in the sheet
 */
export const BottomSheet = memo(function BottomSheet({ visible, onClose, children }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
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
      {/* Backdrop */}
      <Pressable
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
      
      {/* Sheet Content */}
      <View
        style={{
          backgroundColor: "#fff",
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
});

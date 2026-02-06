import React, { memo } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ToastConfig {
  visible: boolean;
  title: string;
  subtitle?: string;
  canEdit: boolean;
}

/**
 * ActionToast Component
 * 
 * A floating notification bar that appears at the bottom of the screen
 * after an action is performed. Includes Undo and Edit buttons.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {Object} props.toast - Toast configuration object
 * @param {boolean} props.toast.visible - Whether toast is visible
 * @param {string} props.toast.title - Main toast message
 * @param {string} props.toast.subtitle - Optional secondary message
 * @param {boolean} props.toast.canEdit - Whether edit button is enabled
 * @param {Function} props.onUndo - Callback when Undo is pressed
 * @param {Function} props.onEdit - Callback when Edit is pressed
 * @param {Function} props.onClose - Callback when close icon is pressed
 */
export const ActionToast = memo(function ActionToast({ toast, onUndo, onEdit, onClose }: {
  toast: ToastConfig;
  onUndo: () => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  if (!toast?.visible) return null;
  
  const canEdit = toast.canEdit;
  
  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: Platform.OS === "ios" ? 88 : 70,
      }}
    >
      <View
        style={{
          backgroundColor: "#111",
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Message */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {toast.title}
          </Text>
          {!!toast.subtitle && (
            <Text
              style={{
                marginTop: 2,
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
              }}
            >
              {toast.subtitle}
            </Text>
          )}
        </View>

        {/* Undo Button */}
        <Pressable
          onPress={onUndo}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Annuler</Text>
        </Pressable>

        {/* Separator */}
        <Text style={{ color: "rgba(255,255,255,0.25)" }}>•</Text>

        {/* Edit Button */}
        <Pressable
          onPress={canEdit ? onEdit : undefined}
          style={({ pressed }) => ({
            opacity: canEdit ? (pressed ? 0.8 : 1) : 0.35,
          })}
        >
              <Text style={{ color: "#FBF8F6", fontWeight: "900" }}>Modifier</Text>
        {/* Close Button */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, paddingLeft: 6 })}
        >
          <Ionicons name="close" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
});

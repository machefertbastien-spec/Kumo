/**
 * EventActionSheet - Sheet with actions for an event (Edit, Save, Delete)
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { SFIcon } from '../SFIcon';
import type { Event } from '../../types';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  danger: '#E57373',
};

interface EventActionSheetProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

/**
 * Get activity label based on event type
 */
const getActivityLabel = (e: Event): string => {
  if (e.type === 'sleep') {
    const duration = e.endTs ? Math.round((e.endTs - (e.startTs || e.ts)) / 60000) : 0;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return hours > 0 ? `Dodo ${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `Dodo ${mins}min`;
  }
  if (e.type === 'feeding') return `Biberon ${e.amountMl || 0} ml`;
  if (e.type === 'diaper') {
    const typeLabels: Record<string, string> = {
      pee: 'Couche mouillée',
      poo: 'Couche souillée',
      mixed: 'Couche mixte',
    };
    return typeLabels[e.diaperType || ''] || 'Couche';
  }
  return 'Activité';
};

/**
 * Get activity icon based on event type
 */
const getActivityIcon = (e: Event): string => {
  if (e.type === 'sleep') return '☁️';
  if (e.type === 'feeding') return '🍼';
  if (e.type === 'diaper') return '🧷';
  return '📝';
};

/**
 * Format timestamp to time string
 */
const formatTime = (ts: number): string => {
  const date = new Date(ts);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export function EventActionSheet({
  visible,
  event,
  onClose,
  onEdit,
  onDelete,
}: EventActionSheetProps) {
  if (!event) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {/* Event Info Header */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: THEME.line,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 32 }}>{getActivityIcon(event)}</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '900', color: THEME.text }}>
          {getActivityLabel(event)}
        </Text>
        <Text style={{ fontSize: 14, color: THEME.muted, marginTop: 4, fontWeight: '600' }}>
          {formatTime(event.ts)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ gap: 10 }}>
        {/* Edit Button */}
        <Pressable
          onPress={() => {
            onEdit(event);
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: THEME.primary,
            borderRadius: 16,
            paddingVertical: 14,
            gap: 8,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <SFIcon name="pencil" size={18} color="#FFF" />
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>
            Modifier
          </Text>
        </Pressable>

        {/* Save/Close Button */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: THEME.card,
            borderRadius: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: THEME.line,
            gap: 8,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <SFIcon name="checkmark" size={18} color={THEME.text} />
          <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text }}>
            Enregistrer
          </Text>
        </Pressable>

        {/* Delete Button */}
        <Pressable
          onPress={() => {
            onDelete(event.id);
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF0F0',
            borderRadius: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: '#FFCDD2',
            gap: 8,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <SFIcon name="trash" size={18} color={THEME.danger} />
          <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.danger }}>
            Supprimer
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default EventActionSheet;

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SFIcon } from '../SFIcon';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  green: '#A8B59B',
};

type DiaperType = 'wet' | 'dirty' | 'mixed';

interface AddDiaperSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (params: {
    type: DiaperType;
    date: Date;
    time: Date;
  }) => void;
}

export function AddDiaperSheet({ visible, onClose, onAdd }: AddDiaperSheetProps) {
  const [diaperType, setDiaperType] = useState<DiaperType>('mixed');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAdd = () => {
    onAdd({ type: diaperType, date, time });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            paddingBottom: 12,
          }}
        >
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              padding: 8,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <SFIcon name="arrow.left" size={24} color={THEME.text} />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>🐻</Text>
            <Text style={{ fontSize: 17, fontWeight: '700', color: THEME.text }}>
              Ajouter un change
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Ajouter un change
          </Text>

          {/* Diaper Type Toggle - 3 options */}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={() => setDiaperType('wet')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: diaperType === 'wet' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {diaperType === 'wet' && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: THEME.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: THEME.green }}>✓</Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: diaperType === 'wet' ? THEME.card : THEME.muted,
                }}
              >
                Pipi
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDiaperType('dirty')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: diaperType === 'dirty' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {diaperType === 'dirty' && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: THEME.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: THEME.green }}>✓</Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: diaperType === 'dirty' ? THEME.card : THEME.muted,
                }}
              >
                Caca
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDiaperType('mixed')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: diaperType === 'mixed' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {diaperType === 'mixed' && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: THEME.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: THEME.green }}>✓</Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: diaperType === 'mixed' ? THEME.card : THEME.muted,
                }}
              >
                Mixte
              </Text>
            </Pressable>
          </View>

          {/* Date Selector */}
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: THEME.card,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📅</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.text }}>
              {format(date, 'd MMM yyyy', { locale: fr })}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              locale="fr-FR"
            />
          )}

          {/* Time Selector */}
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={{
              backgroundColor: THEME.card,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🕐</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.text }}>
              {format(time, 'HH:mm')}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: THEME.muted,
                }}
              />
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: THEME.muted,
                }}
              />
            </View>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
              locale="fr-FR"
            />
          )}

          {/* Add Button */}
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => ({
              backgroundColor: THEME.primary,
              borderRadius: 20,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '800',
                color: THEME.card,
              }}
            >
              Ajouter
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

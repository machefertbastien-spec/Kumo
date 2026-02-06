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
import { format, startOfDay } from 'date-fns';
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

type SleepType = 'sieste' | 'nuit';

interface AddSleepSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (params: {
    type: SleepType;
    startDate: Date;
    startTime: Date;
    endTime: Date;
  }) => void;
}

export function AddSleepSheet({ visible, onClose, onAdd }: AddSleepSheetProps) {
  const [sleepType, setSleepType] = useState<SleepType>('sieste');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(() => {
    const end = new Date();
    end.setHours(end.getHours() + 1);
    return end;
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleAdd = () => {
    onAdd({ type: sleepType, startDate, startTime, endTime });
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
              Ajouter un dodo
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
            Ajouter un dodo
          </Text>

          {/* Sleep Type Toggle */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={() => setSleepType('sieste')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: sleepType === 'sieste' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {sleepType === 'sieste' && (
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: sleepType === 'sieste' ? THEME.card : THEME.muted,
                }}
              >
                Sieste
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSleepType('nuit')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: sleepType === 'nuit' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {sleepType === 'nuit' && (
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
                  fontSize: 16,
                  fontWeight: '700',
                  color: sleepType === 'nuit' ? THEME.card : THEME.muted,
                }}
              >
                Nuit
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
              {format(startDate, 'd MMM yyyy', { locale: fr })}
            </Text>
          </Pressable>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
              locale="fr-FR"
            />
          )}

          {/* Start Time */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: THEME.muted,
              marginBottom: 8,
            }}
          >
            Heure de début
          </Text>
          <Pressable
            onPress={() => setShowStartTimePicker(true)}
            style={{
              backgroundColor: THEME.card,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🕐</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.text }}>
              {format(startTime, 'HH:mm')}
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

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setStartTime(selectedTime);
                }
              }}
              locale="fr-FR"
            />
          )}

          {/* End Time */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: THEME.muted,
              marginBottom: 8,
            }}
          >
            Heure de fin
          </Text>
          <Pressable
            onPress={() => setShowEndTimePicker(true)}
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
              {format(endTime, 'HH:mm')}
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

          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setEndTime(selectedTime);
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

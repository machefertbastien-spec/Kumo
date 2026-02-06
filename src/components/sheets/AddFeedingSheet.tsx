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
  teal: '#E6A77D',
};

type FeedingType = 'bottle' | 'breastfeeding';

interface AddFeedingSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (params: {
    type: FeedingType;
    date: Date;
    time: Date;
    amountMl: number;
    durationMin?: number;
  }) => void;
  defaultAmount?: number;
}

export function AddFeedingSheet({ 
  visible, 
  onClose, 
  onAdd,
  defaultAmount = 150,
}: AddFeedingSheetProps) {
  const [feedingType, setFeedingType] = useState<FeedingType>('bottle');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [amountMl, setAmountMl] = useState(defaultAmount);
  const [durationMin, setDurationMin] = useState(15);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleIncrement = () => {
    setAmountMl((prev) => prev + 10);
  };

  const handleDecrement = () => {
    setAmountMl((prev) => Math.max(0, prev - 10));
  };

  const handleAdd = () => {
    onAdd({ 
      type: feedingType, 
      date, 
      time, 
      amountMl,
      durationMin: feedingType === 'breastfeeding' ? durationMin : undefined,
    });
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
              Ajouter un biberon
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
            Ajouter un biberon
          </Text>

          {/* Feeding Type Toggle */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={() => setFeedingType('bottle')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: feedingType === 'bottle' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {feedingType === 'bottle' && (
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
                  color: feedingType === 'bottle' ? THEME.card : THEME.muted,
                }}
              >
                Biberon
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFeedingType('breastfeeding')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: feedingType === 'breastfeeding' ? THEME.green : THEME.line,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {feedingType === 'breastfeeding' && (
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
                  color: feedingType === 'breastfeeding' ? THEME.card : THEME.muted,
                }}
              >
                Allaitement
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
              marginBottom: 20,
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

          {/* Duration Control - Only for breastfeeding */}
          {feedingType === 'breastfeeding' && (
            <>
              <View
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>⏱️</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.text }}>
                      Durée
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Pressable
                      onPress={() => setDurationMin((prev) => Math.max(1, prev - 5))}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: pressed ? THEME.line : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ fontSize: 22, color: THEME.primary, fontWeight: '600' }}>
                        −
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setDurationMin((prev) => prev + 5)}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: pressed ? THEME.line : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ fontSize: 22, color: THEME.primary, fontWeight: '600' }}>
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Duration Display */}
              <View
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '800',
                    color: THEME.text,
                  }}
                >
                  {durationMin} min
                </Text>
              </View>
            </>
          )}

          {/* Quantity Control - Only for bottle */}
          {feedingType === 'bottle' && (
            <>
              <View
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>🍼</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.text }}>
                      Quantité
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Pressable
                      onPress={handleIncrement}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: pressed ? THEME.line : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ fontSize: 22, color: THEME.primary, fontWeight: '600' }}>
                        +
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleDecrement}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: pressed ? THEME.line : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Text style={{ fontSize: 22, color: THEME.primary, fontWeight: '600' }}>
                        −
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Amount Display */}
              <View
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '800',
                    color: THEME.text,
                  }}
                >
                  {amountMl} ml
                </Text>
              </View>
            </>
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

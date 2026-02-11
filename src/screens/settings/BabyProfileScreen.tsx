import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseISODate, toLocalDateInputValue } from '../../utils/dateUtils';

// Context
import { useBaby } from '../../contexts';

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
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

export function BabyProfileScreen({ navigation }: any) {
  // Use context hooks
  const { baby, onUpdateBaby } = useBaby();

  const [name, setName] = useState(baby?.name ?? '');
  const [birth, setBirth] = useState(baby?.birthDateISO ? parseISODate(baby.birthDateISO) : new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setName(baby?.name ?? '');
    setBirth(baby?.birthDateISO ? parseISODate(baby.birthDateISO) : new Date());
  }, [baby]);

  const onBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    if (navigation?.popToTop) {
      navigation.popToTop();
      return;
    }
    if (navigation?.navigate) {
      navigation.navigate('SettingsHome');
      return;
    }
    navigation?.getParent?.()?.navigate?.('Settings', { screen: 'SettingsHome' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }} edges={['top', 'left', 'right']}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: THEME.line,
          backgroundColor: THEME.bg,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            style={({ pressed }) => ({
              minWidth: 44,
              height: 44,
              borderRadius: 22,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
              opacity: pressed ? 0.7 : 1,
              marginRight: 8,
              backgroundColor: THEME.card,
              borderWidth: 1,
              borderColor: THEME.line,
            })}
          >
            <Ionicons name="chevron-back" size={20} color={THEME.text} />
            <Text style={{ marginLeft: 2, fontSize: 14, fontWeight: '700', color: THEME.text }}>Retour</Text>
          </Pressable>
          <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text }}>Profil</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>

        <Card style={{ marginTop: 12, padding: 14 }}>
          <Text style={{ fontWeight: '900', color: THEME.text }}>Prénom</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Emma"
            style={{
              marginTop: 8,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: THEME.line,
              backgroundColor: THEME.card,
              fontWeight: '700',
            }}
          />

          <Text style={{ marginTop: 12, fontWeight: '900', color: THEME.text }}>Date de naissance</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={toLocalDateInputValue(birth)}
              onChange={(e: any) => setBirth(parseISODate(e.target.value))}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '16px',
                border: `1px solid ${THEME.line}`,
                backgroundColor: THEME.card,
                fontWeight: '700',
                fontSize: '16px',
              }}
            />
          ) : (
            <Pressable
              onPress={() => setShowPicker(true)}
              style={({ pressed }) => ({
                marginTop: 8,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: THEME.line,
                backgroundColor: pressed ? THEME.line : THEME.card,
              })}
            >
              <Text style={{ fontWeight: '800', color: THEME.text }}>
                {format(birth, 'dd MMMM yyyy', { locale: fr })}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              if (!name.trim()) return;
              onUpdateBaby({
                ...baby,
                name: name.trim(),
                birthDateISO: toLocalDateInputValue(birth),
              });
              Alert.alert('OK', 'Profil mis à jour');
            }}
            style={({ pressed }) => ({
              marginTop: 14,
              paddingVertical: 14,
              borderRadius: 18,
              backgroundColor: THEME.primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ color: THEME.card, textAlign: 'center', fontWeight: '900' }}>Enregistrer</Text>
          </Pressable>
        </Card>
      </ScrollView>

      {showPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={birth}
          mode="date"
          onChange={(evt, picked) => {
            setShowPicker(false);
            if (picked) setBirth(picked);
          }}
        />
      )}
    </SafeAreaView>
  );
}


import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseISODate } from '../../utils/dateUtils';
import { SFIcon } from '../../components/SFIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context
import { useBaby, useReminders } from '../../contexts';

// Theme
const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

// Icon Helper
const Icon = ({ name, size = 24, color = THEME.text, ...props }: any) => {
  const iconMapping: Record<string, string> = {
    'notifications-outline': 'bell',
    'people-outline': 'person',
    'color-palette-outline': 'paintpalette',
    'help-circle-outline': 'questionmark.circle',
    'shield-checkmark-outline': 'checkmark.shield',
  };
  
  return <SFIcon name={iconMapping[name] || 'bell'} size={size} color={color} />;
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

// Divider Component
const Divider = () => <View style={{ height: 1, backgroundColor: THEME.line, marginVertical: 12 }} />;

// RowNav Component
const RowNav = ({ iconName, title, subtitle, onPress }: any) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: THEME.line,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Icon name={iconName} size={18} color={THEME.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '800', color: THEME.text }}>{title}</Text>
        {!!subtitle && <Text style={{ marginTop: 2, fontSize: 12, color: THEME.muted }}>{subtitle}</Text>}
      </View>
      <Text style={{ fontSize: 18, color: THEME.muted }}>›</Text>
    </Pressable>
  );
};

export function SettingsHomeScreen({ navigation }: any) {
  // Use context hooks
  const { baby, onUpdateBaby, setBaby } = useBaby();
  const { reminderSettings } = useReminders();
  const notifSubtitle = reminderSettings.pushEnabled ? 'Rappels activés' : 'Rappels désactivés';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header with back button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SFIcon name="chevron.left" size={24} color={THEME.text} />
          </Pressable>
          
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={require('../../../assets/Header.png')} style={{ width: 120, height: 36 }} resizeMode="contain" />
          </View>
          
          {/* Right spacer for centering */}
          <View style={{ width: 44 }} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 16 }}>Profil</Text>

        <Card style={{ marginTop: 12, padding: 14 }}>
          <Text style={{ fontWeight: '800', color: THEME.muted }}>Profil de bébé</Text>

          <Pressable
            onPress={() => navigation.navigate('BabyProfile')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginTop: 12,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                backgroundColor: '#F5E5D8',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: THEME.line,
              }}
            >
              <Text style={{ fontSize: 24 }}>{baby?.avatar ?? '👶'}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: THEME.text }}>
                {baby?.name ?? 'Bébé'}
              </Text>
              <Text style={{ marginTop: 2, color: THEME.muted, fontWeight: '700' }}>Appuie pour modifier</Text>
            </View>
          </Pressable>

          <Text style={{ marginTop: 14, fontWeight: '800', color: THEME.muted }}>Choisir un avatar</Text>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {['👶', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿'].map((a) => {
              const active = (baby?.avatar ?? '👶') === a;
              return (
                <Pressable
                  key={a}
                  onPress={() => onUpdateBaby({ ...baby, avatar: a })}
                  style={({ pressed }) => ({
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: active ? THEME.primary : THEME.card,
                    borderWidth: 1,
                    borderColor: active ? THEME.primary : THEME.line,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontSize: 18, color: active ? THEME.card : THEME.text }}>{a}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '800', color: THEME.muted }}>Date de naissance</Text>
            <Text style={{ fontWeight: '900', color: THEME.text }}>
              {baby?.birthDateISO ? format(parseISODate(baby.birthDateISO), 'dd MMMM yyyy', { locale: fr }) : '—'}
            </Text>
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '800', color: THEME.muted }}>Poids de naissance</Text>
            <Text style={{ fontWeight: '900', color: THEME.text }}>
              {baby?.initialWeight ? `${baby.initialWeight.toFixed(2)} kg` : '—'}
            </Text>
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '800', color: THEME.muted }}>Taille de naissance</Text>
            <Text style={{ fontWeight: '900', color: THEME.text }}>
              {baby?.initialHeight ? `${baby.initialHeight} cm` : '—'}
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <RowNav iconName="notifications-outline" title="Notifications" subtitle={notifSubtitle} onPress={() => navigation.navigate('Notifications')} />
          <Divider />
          <RowNav iconName="people-outline" title="Partager avec un co-parent" subtitle="Inviter quelqu'un" onPress={() => navigation.navigate('Share')} />
        </Card>

        <Card style={{ marginTop: 12 }}>
          <RowNav iconName="help-circle-outline" title="Aide & FAQ" subtitle="" onPress={() => Alert.alert('TODO', 'Écran FAQ (V1)')} />
          <Divider />
          <RowNav iconName="shield-checkmark-outline" title="Confidentialité" subtitle="" onPress={() => Alert.alert('TODO', 'Écran Confidentialité (V1)')} />
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Pressable
            onPress={() => {
              Alert.alert(
                '🔄 Réinitialiser',
                'Supprimer toutes les données et revenir à l\'onboarding ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: async () => {
                      await AsyncStorage.clear();
                      setBaby(null);
                    },
                  },
                ]
              );
            }}
            style={({ pressed }) => ({
              paddingVertical: 14,
              paddingHorizontal: 14,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#FF3B30', textAlign: 'center' }}>
              🔄 Réinitialiser l'app (Développement)
            </Text>
          </Pressable>
        </Card>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


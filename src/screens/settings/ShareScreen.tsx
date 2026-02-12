import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

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

export function ShareScreen({ navigation, baby, settings, caregiver, events, onImport }: any) {
  const exportData = async () => {
    const payload = {
      version: 3,
      exportedAtMs: Date.now(),
      baby,
      settings,
      caregiver,
      events: events.filter((e: any) => !e.deletedAt),
    };
    const text = JSON.stringify(payload);
    await Clipboard.setStringAsync(text);
    try {
      await Share.share({ message: text });
    } catch (err) {
      // eslint(no-empty): ensure this catch is not considered an empty block
      void err;
    }
    Alert.alert('Export OK', 'Le code a été copié dans le presse-papiers.');
  };

  const [importText, setImportText] = useState('');
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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
          <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text }}>Partager</Text>
        </View>

        <Card style={{ marginTop: 12, padding: 14 }}>
          <Text style={{ fontWeight: '900', color: THEME.text }}>Exporter</Text>
          <Text style={{ marginTop: 6, color: THEME.muted }}>
            Envoie ce code à ton co-parent, puis importez de l'autre côté.
          </Text>

          <Pressable
            onPress={exportData}
            style={({ pressed }) => ({
              marginTop: 12,
              paddingVertical: 14,
              borderRadius: 18,
              backgroundColor: THEME.primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ color: THEME.card, textAlign: 'center', fontWeight: '900' }}>Exporter (copier + partager)</Text>
          </Pressable>
        </Card>

        <Card style={{ marginTop: 12, padding: 14 }}>
          <Text style={{ fontWeight: '900', color: THEME.text }}>Importer</Text>
          <Text style={{ marginTop: 6, color: THEME.muted }}>
            Colle ici le code exporté (fusion par id).
          </Text>

          <TextInput
            value={importText}
            onChangeText={setImportText}
            placeholder="Colle ici…"
            multiline
            style={{
              marginTop: 10,
              minHeight: 130,
              padding: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: THEME.line,
              backgroundColor: THEME.card,
              textAlignVertical: 'top',
              fontWeight: '600',
            }}
          />

          <Pressable
            onPress={() => onImport(importText)}
            style={({ pressed }) => ({
              marginTop: 12,
              paddingVertical: 14,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: THEME.line,
              backgroundColor: pressed ? THEME.line : THEME.card,
            })}
          >
            <Text style={{ textAlign: 'center', fontWeight: '900', color: THEME.text }}>Importer</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SleepPlannerSettings as SettingsType } from '../constants/sleepplanner';
import { THEME } from '../constants/theme';

interface SleepPlannerSettingsProps {
  settings: SettingsType;
  onSave: (updated: Partial<SettingsType>) => Promise<void>;
  onClose: () => void;
}

export function SleepPlannerSettings({ settings, onSave, onClose }: SleepPlannerSettingsProps) {
  const [bedtime, setBedtime] = useState(settings.bedtimeTargetHHMM);
  const [napMode, setNapMode] = useState(settings.napCountMode);
  const [nudge, setNudge] = useState(settings.nudgeMin);
  const [windowWidth, setWindowWidth] = useState(settings.windowHalfWidthMin);
  const [notifyBefore, setNotifyBefore] = useState(settings.notifyBeforeMin);
  const [notifEnabled, setNotifEnabled] = useState(settings.enableSleepPlannerNotif);
  
  const handleSave = async () => {
    await onSave({
      bedtimeTargetHHMM: bedtime,
      napCountMode: napMode,
      nudgeMin: nudge,
      windowHalfWidthMin: windowWidth,
      notifyBeforeMin: notifyBefore,
      enableSleepPlannerNotif: notifEnabled,
    });
    onClose();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Paramètres SleepPlanner</Text>
        </View>
        
        {/* Bedtime */}
        <View style={styles.section}>
          <Text style={styles.label}>Heure du coucher</Text>
          <TextInput
            style={styles.textInput}
            value={bedtime}
            onChangeText={setBedtime}
            placeholder="19:30"
            keyboardType="default"
          />
        </View>
        
        {/* Nap Count */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre de siestes</Text>
          <View style={styles.buttonGroup}>
            {['auto', '1', '2', '3', '4'].map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setNapMode(mode as any)}
                style={[
                  styles.groupButton,
                  napMode === mode && styles.groupButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    napMode === mode && styles.groupButtonTextActive,
                  ]}
                >
                  {mode === 'auto' ? 'Auto' : mode}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        {/* Nudge */}
        <View style={styles.section}>
          <Text style={styles.label}>Ajustement: {nudge > 0 ? '+' : ''}{nudge} min</Text>
          <View style={styles.sliderContainer}>
            <Pressable onPress={() => setNudge(Math.max(-15, nudge - 5))} style={styles.sliderButton}>
              <Text style={styles.sliderButtonText}>◀</Text>
            </Pressable>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((nudge + 15) / 30) * 100}%` }]} />
            </View>
            <Pressable onPress={() => setNudge(Math.min(15, nudge + 5))} style={styles.sliderButton}>
              <Text style={styles.sliderButtonText}>▶</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>De -15 à +15 minutes</Text>
        </View>
        
        {/* Window Width */}
        <View style={styles.section}>
          <Text style={styles.label}>Largeur fenêtre: {windowWidth} min</Text>
          <View style={styles.sliderContainer}>
            <Pressable onPress={() => setWindowWidth(Math.max(10, windowWidth - 5))} style={styles.sliderButton}>
              <Text style={styles.sliderButtonText}>◀</Text>
            </Pressable>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((windowWidth - 10) / 20) * 100}%` }]} />
            </View>
            <Pressable onPress={() => setWindowWidth(Math.min(30, windowWidth + 5))} style={styles.sliderButton}>
              <Text style={styles.sliderButtonText}>▶</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>De 10 à 30 minutes</Text>
        </View>
        
        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Notifications</Text>
            <Switch value={notifEnabled} onValueChange={setNotifEnabled} />
          </View>
          
          {notifEnabled && (
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Rappeler {notifyBefore} min avant</Text>
              <View style={styles.sliderContainer}>
                <Pressable onPress={() => setNotifyBefore(Math.max(5, notifyBefore - 5))} style={styles.sliderButton}>
                  <Text style={styles.sliderButtonText}>◀</Text>
                </Pressable>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((notifyBefore - 5) / 25) * 100}%` }]} />
                </View>
                <Pressable onPress={() => setNotifyBefore(Math.min(30, notifyBefore + 5))} style={styles.sliderButton}>
                  <Text style={styles.sliderButtonText}>▶</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        
        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </Pressable>
          
          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
  },
  
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: THEME.line,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: THEME.text,
    backgroundColor: '#fff',
  },
  
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.line,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  groupButtonActive: {
    backgroundColor: THEME.green,
    borderColor: THEME.green,
  },
  groupButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  groupButtonTextActive: {
    color: '#fff',
  },
  
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 16,
    color: THEME.text,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: THEME.green,
  },
  hint: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 6,
  },
  
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subSection: {
    marginTop: 16,
    paddingLeft: 16,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.muted,
    marginBottom: 10,
  },
  
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.line,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: THEME.green,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
});

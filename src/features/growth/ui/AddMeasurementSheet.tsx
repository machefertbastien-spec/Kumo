/**
 * Add Measurement Sheet
 * Bottom sheet for adding new growth measurements
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseISODate, toLocalDateInputValue } from '../../../utils/dateUtils';
import type { Metric, MeasurementSource } from '../types';
import { METRIC_LABELS, METRIC_UNITS, VALIDATION_BOUNDS } from '../types';
import { addMeasurement } from '../storage/measurementsRepo';
import { isValidMeasurement } from '../math/growthMath';

const THEME = {
  primary: '#D48A63',
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  border: '#EFE7E1',
  red: '#E85D75',
};

interface AddMeasurementSheetProps {
  childId: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMeasurementSheet({ childId, visible, onClose, onSuccess }: AddMeasurementSheetProps) {
  const [type, setType] = useState<Metric>('weight');
  const [value, setValue] = useState('');
  const [measuredAt, setMeasuredAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [source, setSource] = useState<MeasurementSource>('home');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const bounds = VALIDATION_BOUNDS[type];

  const handleSave = async () => {
    setError('');

    // Validate value
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('Veuillez entrer une valeur valide');
      return;
    }

    if (!isValidMeasurement(numValue, bounds.min, bounds.max)) {
      setError(`La valeur doit être entre ${bounds.min} et ${bounds.max} ${METRIC_UNITS[type]}`);
      return;
    }

    try {
      setSaving(true);
      await addMeasurement(
        childId,
        type,
        numValue,
        measuredAt.toISOString(),
        source,
        note.trim() || undefined
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[AddMeasurementSheet] Failed to save:', err);
      setError('Impossible de sauvegarder la mesure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {/* Header */}
              <View style={styles.header}>
          <Text style={styles.title}>Nouvelle mesure</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
        </View>

        {/* Type Selector */}
        <Text style={styles.label}>Type de mesure</Text>
        <View style={styles.typeSelector}>
          {(['weight', 'length'] as Metric[]).map(t => (
            <Pressable
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>
                {METRIC_LABELS[t]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Value Input */}
        <Text style={styles.label}>
          Valeur ({METRIC_UNITS[type]})
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={`Ex: ${type === 'weight' ? '4.5' : type === 'length' ? '60' : '40'}`}
          keyboardType="decimal-pad"
          autoFocus
        />
        <Text style={styles.hint}>
          Plage normale: {bounds.min} - {bounds.max} {METRIC_UNITS[type]}
        </Text>

        {/* Date Picker */}
        <Text style={styles.label}>Date de la mesure</Text>
        <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {format(measuredAt, 'dd MMMM yyyy', { locale: fr })}
          </Text>
        </Pressable>

        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={measuredAt}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (date) {
                setMeasuredAt(date);
                if (Platform.OS === 'ios') {
                  setShowDatePicker(false);
                }
              }
            }}
            maximumDate={new Date()}
          />
        )}
        
        {showDatePicker && Platform.OS === 'web' && (
          <View style={styles.webDatePicker}>
            <input
              type="date"
              value={toLocalDateInputValue(measuredAt)}
              max={toLocalDateInputValue(new Date())}
              onChange={(e) => {
                if (e.target.value) {
                  setMeasuredAt(parseISODate(e.target.value));
                }
                setShowDatePicker(false);
              }}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                borderRadius: '12px',
                border: '2px solid #E0E0E0',
                backgroundColor: THEME.card,
              }}
            />
          </View>
        )}

        {/* Source */}
        <Text style={styles.label}>Source</Text>
        <View style={styles.sourceSelector}>
          <Pressable
            style={[styles.sourceButton, source === 'home' && styles.sourceButtonActive]}
            onPress={() => setSource('home')}
          >
            <Text style={[styles.sourceText, source === 'home' && styles.sourceTextActive]}>
              🏠 Maison
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sourceButton, source === 'doctor' && styles.sourceButtonActive]}
            onPress={() => setSource('doctor')}
          >
            <Text style={[styles.sourceText, source === 'doctor' && styles.sourceTextActive]}>
              👨‍⚕️ Pédiatre
            </Text>
          </Pressable>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: THEME.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  container: {
    backgroundColor: THEME.bg,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
  },
  closeButton: {
    fontSize: 24,
    color: THEME.muted,
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 8,
    marginTop: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
  },
  typeTextActive: {
    color: THEME.card,
  },
  input: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    padding: 16,
    fontSize: 16,
    color: THEME.text,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: THEME.muted,
    marginTop: 4,
  },
  dateButton: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: THEME.text,
  },
  webDatePicker: {
    marginTop: 8,
  },
  sourceSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  sourceButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  sourceButtonActive: {
    backgroundColor: THEME.primary + '20',
    borderColor: THEME.primary,
  },
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  sourceTextActive: {
    color: THEME.primary,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: THEME.red,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: THEME.card,
    borderWidth: 2,
    borderColor: THEME.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  saveButton: {
    backgroundColor: THEME.primary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});



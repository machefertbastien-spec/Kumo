import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toLocalDateInputValue } from '../utils/dateUtils';

// Context
import { useBaby } from '../contexts';

// Components
import { OnboardingSteps } from '../components/ui/OnboardingSteps';

// Growth
import { addMeasurement } from '../features/growth';

const THEME = {
  bg: "#F7F1EC",
  text: "#4B3F39",
  muted: "#7A6A60",
  line: "#EFE7E1",
  primary: "#D48A63",
  card: "#FBF8F6",
};

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function normalizeBabyName(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export default function OnboardingScreen() {
  const { onCreateBaby } = useBaby();

  // Multi-step state
  const [step, setStep] = useState(1);
  
  // Step 1: Date de naissance
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  // Step 2: PrÃ©nom et sexe (Ã  implÃ©menter)
  const [name, setName] = useState("");
  const [sex, setSex] = useState<'male' | 'female' | null>(null);
  const [avatar, setAvatar] = useState("ðŸ‘¶");
  
  // Step 3: Poids et taille (Ã  implÃ©menter)
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  
  // Step 4: Relation
  const [relation, setRelation] = useState<'mother' | 'father' | 'other'>('mother');
  
  // Refs for auto-focus
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const canContinueStep1 = day.length === 2 && month.length === 2 && year.length === 4;
  const normalizedName = normalizeBabyName(name);
  const canContinueStep2 = normalizedName.length >= 2;

  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setDay(cleaned);
      if (cleaned.length === 2) {
        monthRef.current?.focus();
      }
    }
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setMonth(cleaned);
      if (cleaned.length === 2) {
        yearRef.current?.focus();
      }
    }
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setYear(cleaned);
    }
  };

  const handleContinueStep1 = () => {
    if (canContinueStep1) {
      // Validate date
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
        return;
      }
      
      setStep(2);
    }
  };

  const handleContinueStep2 = () => {
    if (canContinueStep2) {
      setStep(3);
    }
  };

  const renderStep1 = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingSteps currentStep={1} totalSteps={6} />

          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image 
              source={require('../../assets/Header.png')} 
              style={{ width: 180, height: 180, marginBottom: 0 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, minHeight: 200, marginTop: -40 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Quelle est la date de naissance{'\n'}de votre bÃ©bÃ© ?
            </Text>

            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
              <TextInput
                value={day}
                onChangeText={handleDayChange}
                placeholder="JJ"
                keyboardType="number-pad"
                maxLength={2}
                style={{
                  width: 80,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: THEME.line,
                  backgroundColor: THEME.card,
                  fontSize: 18,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: THEME.text,
                }}
              />
              <Text style={{ fontSize: 20, color: THEME.muted }}>/</Text>
              <TextInput
                ref={monthRef}
                value={month}
                onChangeText={handleMonthChange}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
                style={{
                  width: 80,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: THEME.line,
                  backgroundColor: THEME.card,
                  fontSize: 18,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: THEME.text,
                }}
              />
              <Text style={{ fontSize: 20, color: THEME.muted }}>/</Text>
              <TextInput
                ref={yearRef}
                value={year}
                onChangeText={handleYearChange}
                placeholder="AAAA"
                keyboardType="number-pad"
                maxLength={4}
                style={{
                  width: 100,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: THEME.line,
                  backgroundColor: THEME.card,
                  fontSize: 18,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: THEME.text,
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Boutons fixes en bas */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: THEME.bg }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: pressed ? THEME.line : THEME.card,
                borderWidth: 1,
                borderColor: THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.text, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Retour
              </Text>
            </Pressable>

            <Pressable
              onPress={handleContinueStep1}
              disabled={!canContinueStep1}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: canContinueStep1 
                  ? (pressed ? '#C67952' : THEME.primary)
                  : THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.card, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Continuer
              </Text>
            </Pressable>
          </View>

          <Text style={{ 
            marginTop: 16,
            textAlign: 'center',
            fontSize: 11,
            color: THEME.muted,
          }}>
            Ces informations nous aident simplement Ã  mieux vous accompagner.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderStep2Name = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingSteps currentStep={2} totalSteps={6} />

          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image 
              source={require('../../assets/Header.png')} 
              style={{ width: 120, height: 120, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 12, color: THEME.muted }}>
              Naissance de votre bebe
            </Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, minHeight: 200 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Quel est le prenom de votre enfant ?
            </Text>

            <View style={{ alignItems: 'center' }}>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text.replace(/\s+/g, ' '))}
                placeholder="Ex: Emma"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={30}
                style={{
                  width: '100%',
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: THEME.line,
                  backgroundColor: THEME.card,
                  fontSize: 18,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: THEME.text,
                  paddingHorizontal: 16,
                }}
              />
              {name.length > 0 && !canContinueStep2 && (
                <Text style={{ marginTop: 8, fontSize: 12, color: '#B45309' }}>
                  Entrez au moins 2 caracteres.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Boutons fixes en bas */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: THEME.bg }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => setStep(1)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: pressed ? THEME.line : THEME.card,
                borderWidth: 1,
                borderColor: THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.text, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Retour
              </Text>
            </Pressable>

            <Pressable
              onPress={handleContinueStep2}
              disabled={!canContinueStep2}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: canContinueStep2
                  ? (pressed ? '#C67952' : THEME.primary)
                  : THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.card, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Continuer
              </Text>
            </Pressable>
          </View>

          <Text style={{ 
            marginTop: 16,
            textAlign: 'center',
            fontSize: 11,
            color: THEME.muted,
          }}>
            Ces informations nous aident simplement a mieux vous accompagner.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderStep2 = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingSteps currentStep={3} totalSteps={6} />

          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image 
              source={require('../../assets/Header.png')} 
              style={{ width: 120, height: 120, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 12, color: THEME.muted }}>
              Naissance de votre bÃ©bÃ©
            </Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, minHeight: 200 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Quelle est la taille{'\n'}de votre bÃ©bÃ© ?
            </Text>

            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  value={height}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.,]/g, '').replace('.', ',');
                    setHeight(cleaned);
                  }}
                  placeholder="50"
                  keyboardType="decimal-pad"
                  style={{
                    width: 120,
                    height: 56,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: THEME.line,
                    backgroundColor: THEME.card,
                    fontSize: 18,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: THEME.text,
                  }}
                />
                <Text style={{ fontSize: 16, color: THEME.muted, fontWeight: '600' }}>cm</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Boutons fixes en bas */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: THEME.bg }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => setStep(2)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: pressed ? THEME.line : THEME.card,
                borderWidth: 1,
                borderColor: THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.text, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Retour
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setStep(4)}
              disabled={!height}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: height 
                  ? (pressed ? '#C67952' : THEME.primary)
                  : THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.card, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Continuer
              </Text>
            </Pressable>
          </View>

          <Text style={{ 
            marginTop: 16,
            textAlign: 'center',
            fontSize: 11,
            color: THEME.muted,
          }}>
            Ces informations nous aident simplement Ã  mieux vous accompagner.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderStep3 = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingSteps currentStep={4} totalSteps={6} />

          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image 
              source={require('../../assets/Header.png')} 
              style={{ width: 120, height: 120, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 12, color: THEME.muted }}>
              Naissance de votre bÃ©bÃ©
            </Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, minHeight: 200 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Quel est le poids{'\n'}de votre bÃ©bÃ© ?
            </Text>

            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  value={weight}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9.,]/g, '').replace('.', ',');
                    setWeight(cleaned);
                  }}
                  placeholder="3,5"
                  keyboardType="decimal-pad"
                  style={{
                    width: 120,
                    height: 56,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: THEME.line,
                    backgroundColor: THEME.card,
                    fontSize: 18,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: THEME.text,
                  }}
                />
                <Text style={{ fontSize: 16, color: THEME.muted, fontWeight: '600' }}>kg</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Boutons fixes en bas */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: THEME.bg }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => setStep(3)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: pressed ? THEME.line : THEME.card,
                borderWidth: 1,
                borderColor: THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.text, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Retour
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setStep(5)}
              disabled={!weight}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: weight 
                  ? (pressed ? '#C67952' : THEME.primary)
                  : THEME.line,
              })}
            >
              <Text style={{ 
                color: THEME.card, 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: 16,
              }}>
                Continuer
              </Text>
            </Pressable>
          </View>

          <Text style={{ 
            marginTop: 16,
            textAlign: 'center',
            fontSize: 11,
            color: THEME.muted,
          }}>
            Ces informations nous aident simplement Ã  mieux vous accompagner.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderStep4 = () => (
    <View style={{ flex: 1 }}>
      <OnboardingSteps currentStep={5} totalSteps={6} />

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Image 
          source={require('../../assets/Header.png')} 
          style={{ width: 120, height: 120, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 12, color: THEME.muted }}>
          Naissance de votre bÃ©bÃ©
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600', 
          color: THEME.text,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Quel est le sexe de votre bÃ©bÃ© ?
        </Text>

        <View style={{ gap: 12 }}>
          <Pressable
            onPress={() => setSex('female')}
            style={({ pressed }) => ({
              paddingVertical: 20,
              borderRadius: 12,
              backgroundColor: sex === 'female' ? '#F5E5D8' : THEME.card,
              borderWidth: 2,
              borderColor: sex === 'female' ? THEME.primary : THEME.line,
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: THEME.text,
            }}>
              Fille
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSex('male')}
            style={({ pressed }) => ({
              paddingVertical: 20,
              borderRadius: 12,
              backgroundColor: sex === 'male' ? '#F5E5D8' : THEME.card,
              borderWidth: 2,
              borderColor: sex === 'male' ? THEME.primary : THEME.line,
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: THEME.text,
            }}>
              GarÃ§on
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setStep(4)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: pressed ? THEME.line : THEME.card,
              borderWidth: 1,
              borderColor: THEME.line,
            })}
          >
            <Text style={{ 
              color: THEME.text, 
              textAlign: 'center', 
              fontWeight: '600',
              fontSize: 16,
            }}>
              Retour
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setStep(6)}
            disabled={!sex}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: sex 
                ? (pressed ? '#C67952' : THEME.primary)
                : THEME.line,
            })}
          >
            <Text style={{ 
              color: THEME.card, 
              textAlign: 'center', 
              fontWeight: '600',
              fontSize: 16,
            }}>
              Continuer
            </Text>
          </Pressable>
        </View>

        <Text style={{ 
          marginTop: 16,
          textAlign: 'center',
          fontSize: 11,
          color: THEME.muted,
        }}>
          Ces informations nous aident simplement Ã  mieux vous accompagner.
        </Text>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={{ flex: 1 }}>
      <OnboardingSteps currentStep={6} totalSteps={6} />

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Image 
          source={require('../../assets/Header.png')} 
          style={{ width: 120, height: 120, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 12, color: THEME.muted }}>
          Naissance de votre bÃ©bÃ©
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600', 
          color: THEME.text,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Et vous, qui Ãªtes-vous pour ce bÃ©bÃ© ?
        </Text>

        <View style={{ gap: 12 }}>
          <Pressable
            onPress={() => setRelation('mother')}
            style={({ pressed }) => ({
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 12,
              backgroundColor: THEME.card,
              borderWidth: 1,
              borderColor: relation === 'mother' ? THEME.primary : THEME.line,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: relation === 'mother' ? THEME.primary : THEME.line,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {relation === 'mother' && (
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: THEME.primary,
                }} />
              )}
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: THEME.text,
            }}>
              Maman
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRelation('father')}
            style={({ pressed }) => ({
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 12,
              backgroundColor: THEME.card,
              borderWidth: 1,
              borderColor: relation === 'father' ? THEME.primary : THEME.line,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: relation === 'father' ? THEME.primary : THEME.line,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {relation === 'father' && (
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: THEME.primary,
                }} />
              )}
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: THEME.text,
            }}>
              Papa
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRelation('other')}
            style={({ pressed }) => ({
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 12,
              backgroundColor: THEME.card,
              borderWidth: 1,
              borderColor: relation === 'other' ? THEME.primary : THEME.line,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: relation === 'other' ? THEME.primary : THEME.line,
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {relation === 'other' && (
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: THEME.primary,
                }} />
              )}
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: THEME.text,
            }}>
              Autre parent /{'\n'}proche
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setStep(5)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: pressed ? THEME.line : THEME.card,
              borderWidth: 1,
              borderColor: THEME.line,
            })}
          >
            <Text style={{ 
              color: THEME.text, 
              textAlign: 'center', 
              fontWeight: '600',
              fontSize: 16,
            }}>
              Retour
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              const finalName = normalizedName.length >= 2 ? normalizedName : 'Bebe';
              const birthDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
              
              const babyId = makeId();
              const weightValue = weight ? parseFloat(weight.replace(',', '.')) : undefined;
              const heightValue = height ? parseFloat(height.replace(',', '.')) : undefined;
              
              await onCreateBaby({
                id: babyId,
                name: finalName,
                birthDateISO: toLocalDateInputValue(birthDate),
                avatar,
                sex,
                createdAt: Date.now(),
                initialWeight: weightValue,
                initialHeight: heightValue,
              });
              
              console.log('[Onboarding] Baby created with ID:', babyId);
              console.log('[Onboarding] Weight:', weightValue, 'Height:', heightValue);
              
              // Sauvegarder les mesures initiales dans le systÃ¨me de croissance
              const measuredAt = birthDate.toISOString();
              if (weightValue) {
                console.log('[Onboarding] Saving weight measurement...');
                await addMeasurement(babyId, 'weight', weightValue, measuredAt);
                console.log('[Onboarding] Weight measurement saved!');
              }
              if (heightValue) {
                console.log('[Onboarding] Saving height measurement...');
                await addMeasurement(babyId, 'length', heightValue, measuredAt);
                console.log('[Onboarding] Height measurement saved!');
              }
            }}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: pressed ? '#C67952' : THEME.primary,
            })}
          >
            <Text style={{ 
              color: THEME.card, 
              textAlign: 'center', 
              fontWeight: '600',
              fontSize: 16,
            }}>
              Continuer
            </Text>
          </Pressable>
        </View>

        <Text style={{ 
          marginTop: 16,
          textAlign: 'center',
          fontSize: 11,
          color: THEME.muted,
        }}>
          Ces informations nous aident simplement Ã  mieux vous accompagner.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2Name()}
      {step === 3 && renderStep2()}
      {step === 4 && renderStep3()}
      {step === 5 && renderStep4()}
      {step === 6 && renderStep5()}
    </SafeAreaView>
  );
}



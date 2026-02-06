/**
 * OnboardingSteps - Progress bar component for onboarding flow
 * Shows step indicators with connecting lines
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const THEME = {
  bg: '#F7F1EC',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  card: '#FBF8F6',
};

interface OnboardingStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingSteps({ currentStep, totalSteps }: OnboardingStepsProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => (
          <StepItem
            key={step}
            step={step}
            index={index}
            currentStep={currentStep}
            isLast={index === steps.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

interface StepItemProps {
  step: number;
  index: number;
  currentStep: number;
  isLast: boolean;
}

function StepItem({ step, index, currentStep, isLast }: StepItemProps) {
  const isComplete = step < currentStep;
  const isCurrent = step === currentStep;
  const isIncomplete = step > currentStep;

  // Animation for the current step
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCurrent) {
      // Subtle pulse animation for current step
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(1);
      pulseAnim.setValue(0);
    }
  }, [isCurrent, scaleAnim, pulseAnim]);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={[styles.stepItem, !isLast && styles.stepItemWithSeparator]}>
      {/* Step indicator */}
      <Animated.View
        style={[
          styles.indicator,
          isComplete && styles.indicatorComplete,
          isCurrent && styles.indicatorCurrent,
          isIncomplete && styles.indicatorIncomplete,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Pulse ring for current step */}
        {isCurrent && (
          <Animated.View
            style={[
              styles.pulseRing,
              { opacity: pulseOpacity },
            ]}
          />
        )}
        
        {isComplete ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text
            style={[
              styles.stepNumber,
              isCurrent && styles.stepNumberCurrent,
              isIncomplete && styles.stepNumberIncomplete,
            ]}
          >
            {step}
          </Text>
        )}
      </Animated.View>

      {/* Separator line */}
      {!isLast && (
        <View style={styles.separatorContainer}>
          <View
            style={[
              styles.separator,
              isComplete && styles.separatorComplete,
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItemWithSeparator: {
    flex: 1,
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.card,
    position: 'relative',
    zIndex: 1,
  },
  indicatorComplete: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  indicatorCurrent: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  indicatorIncomplete: {
    backgroundColor: THEME.card,
    borderColor: THEME.line,
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  stepNumberCurrent: {
    color: '#FFFFFF',
  },
  stepNumberIncomplete: {
    color: THEME.muted,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  separatorContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  separator: {
    height: 2,
    backgroundColor: THEME.line,
    borderRadius: 1,
  },
  separatorComplete: {
    backgroundColor: THEME.primary,
  },
});

export default OnboardingSteps;

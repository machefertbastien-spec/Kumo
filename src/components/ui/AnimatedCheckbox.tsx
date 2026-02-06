// src/components/ui/AnimatedCheckbox.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

const THEME = {
  primary: '#D48A63',
  primaryLight: 'rgba(212, 138, 99, 0.2)',
  card: '#FBF8F6',
  line: '#E8D5C4',
};

interface AnimatedCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
}

export function AnimatedCheckbox({ checked, onPress, size = 24 }: AnimatedCheckboxProps) {
  // Native driver animations (transform, opacity)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  
  // JS driver animation (color) - separate value to avoid mixing
  const colorAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    if (checked) {
      // Animation sequence when checked
      Animated.sequence([
        // Pulse in with scale bounce
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
        // Bounce back
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Color animation (JS driver - separate)
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();

      // Checkmark animation
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }).start();

      // Ripple effect
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse glow animation (repeating)
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();
    } else {
      // Animation when unchecked
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Color animation (JS driver - separate)
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(checkmarkAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [checked, scaleAnim, colorAnim, checkmarkAnim, rippleAnim, pulseAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.card, THEME.primary],
  });

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.line, THEME.primary],
  });

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.3, 1],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.2, 0],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0],
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Ripple effect */}
      {checked && (
        <Animated.View
          style={[
            styles.ripple,
            {
              width: size,
              height: size,
              borderRadius: size / 3,
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
      )}

      {/* Pulse glow */}
      {checked && (
        <Animated.View
          style={[
            styles.pulse,
            {
              width: size,
              height: size,
              borderRadius: size / 3,
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
      )}

      {/* Main checkbox - using separate View for color animation */}
      <Animated.View
        style={[
          styles.checkboxOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 3,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.checkbox,
            {
              width: size,
              height: size,
              borderRadius: size / 3,
              backgroundColor,
              borderColor,
            },
          ]}
        >
          {/* Checkmark - using Text character */}
          <Animated.View
            style={{
              transform: [{ scale: checkmarkScale }],
              opacity: checkmarkAnim,
            }}
          >
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    backgroundColor: THEME.primary,
  },
  pulse: {
    position: 'absolute',
    backgroundColor: THEME.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default AnimatedCheckbox;

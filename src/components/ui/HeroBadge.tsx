import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Theme constants matching the app
const THEME = {
  bg: '#FBF8F2',
  card: '#FFFFFF',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
};

type BadgeVariant = 'default' | 'outline' | 'ghost';
type BadgeSize = 'sm' | 'md' | 'lg';

interface HeroBadgeProps {
  text: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  animated?: boolean;
}

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.line,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
};

const sizeStyles: Record<BadgeSize, { container: ViewStyle; text: TextStyle; gap: number }> = {
  sm: {
    container: { paddingHorizontal: 12, paddingVertical: 6 },
    text: { fontSize: 12 },
    gap: 6,
  },
  md: {
    container: { paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14 },
    gap: 8,
  },
  lg: {
    container: { paddingHorizontal: 20, paddingVertical: 10 },
    text: { fontSize: 16 },
    gap: 10,
  },
};

export function HeroBadge({
  text,
  icon,
  endIcon,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
  onPress,
  animated = true,
}: HeroBadgeProps) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-10)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  // Entry animation on mount
  React.useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(1);
      translateYAnim.setValue(0);
    }
  }, [animated, opacityAnim, translateYAnim]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(iconRotateAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(iconRotateAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-10deg'],
  });

  const sizeConfig = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.container,
          variantStyle,
          sizeConfig.container,
          {
            opacity: pressed ? 0.9 : 1,
          },
          style,
        ]}
      >
        {icon && (
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ rotate: iconRotation }] },
            ]}
          >
            {icon}
          </Animated.View>
        )}

        <Text
          style={[
            styles.text,
            sizeConfig.text,
            { marginLeft: icon ? sizeConfig.gap : 0, marginRight: endIcon ? sizeConfig.gap : 0 },
            textStyle,
          ]}
        >
          {text}
        </Text>

        {endIcon && <View style={styles.endIconContainer}>{endIcon}</View>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontWeight: '700',
    color: THEME.text,
  },
  iconContainer: {
    opacity: 0.7,
  },
  endIconContainer: {
    opacity: 0.6,
  },
});

export default HeroBadge;

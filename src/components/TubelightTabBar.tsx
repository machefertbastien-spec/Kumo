/**
 * TubelightTabBar - Animated bottom navigation with tubelight glow effect
 * Inspired by tubelight-navbar design pattern
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SFIcon } from './SFIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const THEME = {
  bg: '#FBF8F2',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#7A7A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  primaryLight: 'rgba(212, 138, 99, 0.15)',
  primaryGlow: 'rgba(212, 138, 99, 0.3)',
};

// Icon mapping for SF Symbols
const iconMapping: Record<string, string> = {
  "home-outline": "house",
  "lightbulb-outline": "lightbulb",
  "sparkles-outline": "sparkles",
  "list-outline": "list.bullet",
  "stats-chart-outline": "chart.bar",
  "settings-outline": "gearshape",
};

interface TubelightTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function TubelightTabBar({ state, descriptors, navigation }: TubelightTabBarProps) {
  const tabCount = state.routes.length;
  const tabWidth = (SCREEN_WIDTH - 32) / tabCount; // 16px padding on each side
  
  // Animated value for the sliding indicator
  const slideAnim = useRef(new Animated.Value(state.index * tabWidth)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate slide to new position
    Animated.spring(slideAnim, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();

    // Pulse glow animation
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [state.index, tabWidth, slideAnim, glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {/* Animated background pill for active tab */}
        <Animated.View
          style={[
            styles.activeBackground,
            {
              width: tabWidth - 8,
              transform: [{ translateX: Animated.add(slideAnim, new Animated.Value(4)) }],
            },
          ]}
        >
          {/* Tubelight glow effect on top */}
          <Animated.View style={[styles.tubelightGlow, { opacity: glowOpacity }]}>
            <View style={styles.glowBar} />
            <View style={styles.glowBlur1} />
            <View style={styles.glowBlur2} />
            <View style={styles.glowBlur3} />
          </Animated.View>
        </Animated.View>

        {/* Tab buttons */}
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const iconName = options.tabBarIconName;
          const sfIconName = iconMapping[iconName] || 'questionmark.circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <SFIcon
                name={sfIconName}
                size={20}
                color={isFocused ? THEME.primary : THEME.muted}
                weight={isFocused ? 'semibold' : 'regular'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? THEME.primary : THEME.muted,
                    fontWeight: isFocused ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  barContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: THEME.line,
    position: 'relative',
    overflow: 'visible',
  },
  activeBackground: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    backgroundColor: THEME.primaryLight,
    borderRadius: 22,
    zIndex: 0,
  },
  tubelightGlow: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -20,
    width: 40,
    alignItems: 'center',
  },
  glowBar: {
    width: 32,
    height: 4,
    backgroundColor: THEME.primary,
    borderRadius: 2,
    marginBottom: 2,
  },
  glowBlur1: {
    position: 'absolute',
    top: -4,
    width: 48,
    height: 12,
    backgroundColor: THEME.primaryGlow,
    borderRadius: 8,
    opacity: 0.6,
  },
  glowBlur2: {
    position: 'absolute',
    top: -2,
    width: 32,
    height: 10,
    backgroundColor: THEME.primaryGlow,
    borderRadius: 6,
    opacity: 0.8,
  },
  glowBlur3: {
    position: 'absolute',
    top: 0,
    width: 16,
    height: 8,
    backgroundColor: THEME.primary,
    borderRadius: 4,
    opacity: 0.4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    zIndex: 1,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default TubelightTabBar;

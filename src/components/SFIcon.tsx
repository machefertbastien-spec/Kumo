import React from 'react';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SFIconProps {
  name: string;
  size?: number;
  color?: string;
  weight?: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
}

// Mapping SF Symbols to Ionicons for Android fallback
const iconMapping: Record<string, keyof typeof Ionicons.glyphMap> = {
  'moon.fill': 'moon',
  'drop.fill': 'water',
  'sparkles': 'sparkles',
  'clock': 'time',
  'arrow.right': 'arrow-forward',
  'bell': 'notifications',
  'xmark': 'close',
  'plus': 'add',
  'minus': 'remove',
  'chart.bar': 'bar-chart',
  'gearshape': 'settings',
  'person': 'person',
  'square.and.arrow.up': 'share',
  'paintpalette': 'color-palette',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'house': 'home',
  'list.bullet': 'list',
  'lightbulb': 'bulb',
  'arrow.left': 'arrow-back',
  'magnifyingglass': 'search',
  'chevron.right': 'chevron-forward',
  'chevron.left': 'chevron-back',
  'paperplane.fill': 'paper-plane',
  'questionmark.circle': 'help-circle',
  'checkmark.shield': 'shield-checkmark',
  'calendar': 'calendar',
  'fork.knife': 'restaurant',
  'thermometer.medium': 'thermometer',
  'heart.text.square.fill': 'heart',
  'exclamationmark.triangle.fill': 'warning',
  'cross.case.fill': 'medkit',
};

export function SFIcon({ name, size = 24, color = '#000', weight = 'regular' }: SFIconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name as any}
        size={size}
        tintColor={color}
        weight={weight}
        type="monochrome"
      />
    );
  }

  // Android fallback to Ionicons
  const iconName = iconMapping[name] ?? 'help-circle';
  return <Ionicons name={iconName} size={size} color={color} />;
}

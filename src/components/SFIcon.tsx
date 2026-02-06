import React from 'react';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import * as HeroIcons from 'react-native-heroicons/outline';

interface SFIconProps {
  name: string;
  size?: number;
  color?: string;
  weight?: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
}

// Mapping SF Symbols to Heroicons for Android fallback
const iconMapping: Record<string, keyof typeof HeroIcons> = {
  'moon.fill': 'MoonIcon',
  'drop.fill': 'BeakerIcon',
  'sparkles': 'SparklesIcon',
  'clock': 'ClockIcon',
  'arrow.right': 'ChevronRightIcon',
  'bell': 'BellIcon',
  'xmark': 'XMarkIcon',
  'plus': 'PlusIcon',
  'minus': 'MinusIcon',
  'chart.bar': 'ChartBarIcon',
  'gearshape': 'Cog6ToothIcon',
  'person': 'UserIcon',
  'square.and.arrow.up': 'ShareIcon',
  'paintpalette': 'SwatchIcon',
  'chart.line.uptrend.xyaxis': 'ArrowTrendingUpIcon',
  'house': 'HomeIcon',
  'list.bullet': 'ListBulletIcon',
  'lightbulb': 'LightBulbIcon',
  'arrow.left': 'ArrowLeftIcon',
  'magnifyingglass': 'MagnifyingGlassIcon',
  'chevron.right': 'ChevronRightIcon',
  'chevron.left': 'ChevronLeftIcon',
  'paperplane.fill': 'PaperAirplaneIcon',
  'questionmark.circle': 'QuestionMarkCircleIcon',
  'checkmark.shield': 'ShieldCheckIcon',
  'calendar': 'CalendarIcon',
  'fork.knife': 'BeakerIcon',
  'thermometer.medium': 'FireIcon',
  'heart.text.square.fill': 'HeartIcon',
  'exclamationmark.triangle.fill': 'ExclamationTriangleIcon',
  'cross.case.fill': 'PlusIcon',
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

  // Android fallback to Heroicons
  const HeroIcon = iconMapping[name] ? HeroIcons[iconMapping[name]] : HeroIcons.QuestionMarkCircleIcon;
  return <HeroIcon width={size} height={size} color={color} />;
}

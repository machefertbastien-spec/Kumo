/**
 * ScreenHeader - Reusable header component with settings button
 * Displays a centered title/logo and a settings gear icon on the right
 */

import React from 'react';
import { View, Pressable, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SFIcon } from '../SFIcon';
import { THEME } from '../../constants/theme';

interface ScreenHeaderProps {
  /** Show logo instead of title */
  showLogo?: boolean;
  /** Title text (ignored if showLogo is true) */
  title?: string;
  /** Show the settings button (default: true) */
  showSettings?: boolean;
}

export function ScreenHeader({ 
  showLogo = false, 
  title, 
  showSettings = true 
}: ScreenHeaderProps) {
  const navigation = useNavigation<any>();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      {/* Left spacer for centering */}
      <View style={styles.spacer} />

      {/* Center: Logo or Title */}
      <View style={styles.center}>
        {showLogo ? (
          <Image
            source={require('../../../assets/Header.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : title ? (
          <Text style={styles.title}>{title}</Text>
        ) : null}
      </View>

      {/* Right: Settings Button */}
      <View style={styles.spacer}>
        {showSettings && (
          <Pressable
            onPress={handleSettingsPress}
            style={({ pressed }) => [
              styles.settingsButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SFIcon name="gearshape.fill" size={24} color={THEME.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  spacer: {
    width: 44,
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScreenHeader;

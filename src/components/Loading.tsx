/**
 * Loading Component
 * 
 * Displays a loading indicator with optional message.
 * Used for async operations like data loading.
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  message = 'Chargement...', 
  size = 'large', 
  color = '#6C63FF',
  fullScreen = false 
}: LoadingProps) {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.bg,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: THEME.muted,
    fontWeight: '600',
  },
});

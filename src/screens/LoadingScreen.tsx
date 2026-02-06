import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { TypewriterText } from '../components/ui/TypewriterText';

const THEME = {
  bg: '#F7F1EC',
  primary: '#D48A63',
  text: '#4B3F39',
};

export function LoadingScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar from 0 to 100% over 9 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 9000,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Logo Kumo */}
      <Image
        source={require('../../assets/Header.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Tagline avec effet typewriter */}
      <TypewriterText
        text={['Suivre.', 'Comprendre.', 'Souffler.']}
        speed={80}
        deleteSpeed={40}
        delay={1000}
        loop={true}
        cursor="_"
        style={styles.tagline}
      />

      {/* Barre de chargement */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressWidth },
          ]}
        />
      </View>

      {/* Texte Chargement */}
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.text,
    opacity: 0.8,
    marginBottom: 40,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 40,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#E8D5C4',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 999,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    opacity: 0.7,
  },
});

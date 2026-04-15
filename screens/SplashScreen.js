import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold } from '@expo-google-fonts/raleway';

export default function SplashScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    Raleway_300Light,
    Raleway_500Medium,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <LinearGradient colors={['#0A0F1E', '#0F172A', '#0C1A2E']} style={styles.loadingContainer}>
        <ActivityIndicator color="#38BDF8" size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0F1E', '#0F172A', '#0C1A2E']} style={styles.container}>

      <Text style={styles.tagline}>YOUR LIFE IS THE CONTENT</Text>

      <View style={styles.heroContainer}>
        <View style={styles.logoRow}>
          <Text style={styles.atlasText}>Atlas</Text>
          <Text style={styles.aiText}>.ai</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        AI-powered content curation for creators{'\n'}who actually live.
      </Text>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Auth')}
          activeOpacity={0.85}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Auth')}
          activeOpacity={0.7}
        >
          <Text style={styles.signInText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  tagline: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 11,
    color: '#38BDF8',
    letterSpacing: 4,
    textAlign: 'center',
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  atlasText: {
    fontFamily: 'Raleway_300Light',
    fontSize: 72,
    color: '#F1F5F9',
    letterSpacing: 2,
    lineHeight: 80,
  },
  aiText: {
    fontFamily: 'Raleway_300Light',
    fontSize: 36,
    color: '#38BDF8',
    letterSpacing: 2,
    lineHeight: 72,
    marginTop: -8,
  },
  subtitle: {
    fontFamily: 'Raleway_300Light',
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    letterSpacing: 0.3,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  getStartedButton: {
    width: '100%',
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  getStartedText: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 16,
    color: '#0A0F1E',
    letterSpacing: 0.5,
  },
  signInText: {
    fontFamily: 'Raleway_500Medium',
    fontSize: 14,
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
});

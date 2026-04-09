import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.topSection}>
        <Text style={styles.tagline}>YOUR LIFE IS THE CONTENT</Text>
      </View>
      <View style={styles.centerSection}>
        <Text style={styles.logo}>VIRAL</Text>
        <Text style={styles.logoAccent}>VAULT</Text>
        <Text style={styles.subtitle}>
          AI-powered content curation for creators who actually live.
        </Text>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  topSection: { alignItems: 'center' },
  tagline: {
    color: '#ff6b35',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
  },
  centerSection: { alignItems: 'center' },
  logo: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 70,
  },
  logoAccent: {
    color: '#ff6b35',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 70,
  },
  subtitle: {
    color: '#888888',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    maxWidth: 280,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#ff6b35',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryButton: { paddingVertical: 10 },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 14,
  },
});
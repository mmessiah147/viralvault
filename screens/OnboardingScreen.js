import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: 1, screen: 'Home', color: '#38BDF8', icon: '⌂', title: 'Your Command Center', description: 'Live stats, AI suggestions, and upcoming posts — all personalized to your content pillars. Customize your dashboard just like iPhone Control Center.' },
  { id: 2, screen: 'Library', color: '#34D399', icon: '◫', title: 'AI Content Clustering', description: 'Atlas AI scans your camera roll using computer vision and groups your photosllar automatically. No manual tagging needed.' },
  { id: 3, screen: 'Create', color: '#0EA5E9', icon: '✦', title: 'AI Post Builder', description: 'The AI selects your best photos, arranges them for maximum virality, and writes captions in your voice. You review and approve before anything goes live.' },
  { id: 4, screen: 'Analytics', color: '#FBBF24', icon: '◈', title: 'Growth Intelligence', description: 'Track weekly and monthly growth by pillar. See exactly which content is driving your audience and where to double down.' },
  { id: 5, screen: 'Intel', color: '#A78BFA', icon: '◉', title: 'Competitive Intel', description: 'Enter any creator handle to discover their trending clusters, best posting times, and angles you can adopt for your own brand.' },
  { id: 6, screen: 'Settings', color: '#F472B6', icon: '❋', title: 'Your Brand DNA', description: 'Connect Instagram and TikTok, define your content pillars, set your posting cadence, and manage your Atlas.ai tion.' },
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const [fontsLoaded] = useFonts({ Cinzel_700Bold, Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold });

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <LinearGradient colors={['#0A0F1E', '#0F172A', '#0C1A2E']} style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <Text style={styles.logo}>Atlas</Text>
            <Text style={[styles.logoAccent, { color: slide.color }]}>.ai</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.replace('Main')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slideContainer}>
          <View style={[styles.iconCircle, { backgroundColor: slide.color + '18', borderColor: slide.color + '40' }]}>
            <Text style={[styles.iconText, { color: slide.color }]}>{slide.icon}</Text>
          </View>
          <View style={[styles.screenBadge, { backgroundColor: slide.color + '18', borderColor: slide.color + '30' }]}>
            <Text style={[styles.screenBadgeText, { color: slide.color }]}>{slide.screen.toUpperCase()}</Text>
          </View>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </View>

        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrent(i)}>
              <View style={[styles.dot, i === current && { backgroundColor: slide.color, width: 28 }]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomButtons}>
          {current > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrent(current - 1)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: slide.color }]}
            onPress={() => isLast ? navigation.replace('Main') : setCurrent(current + 1)}
          >
            <Text style={styles.nextButtonText}>{isLast ? 'Enter Atlas.ai' : 'Next'}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logo: { color: '#F1F5F9', fontSize: 22, fontFamily: 'Cinzel_700Bold', letterSpacing: 1 },
  logoAccent: { fontSize: 16, fontFamily: 'Raleway_300Light' },
  skipText: { color: '#94A3B8', fontSize: 14, fontFamily: 'Raleway_500Medium' },
  slideContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  iconCircle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  iconText: { fontSize: 44 },
  screenBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  screenBadgeText: { fontSize: 11, fontFamily: 'Raleway_700Bold', letterSpacing: 2 },
  slideTitle: { color: '#F1F5F9', fontSize: 28, fontFamily: 'Raleway_700Bold', textAlign: 'center' },
  slideDescription: { color: '#94A3B8', fontSize: 15, fontFamily: 'Raleway_300Light', textAlign: 'center', lineHeight: 26, maxWidth: 320 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1E293B' },
  bottomButtons: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  backButton: { flex: 1, backgroundColor: '#111827', paddingVertical: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  backButtonText: { color: '#F1F5F9', fontSize: 16, fontFamily: 'Raleway_600SemiBold' },
  nextButton: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  nextButtonText: { color: '#0A0F1E', fontSize: 16, fontFamily: 'Raleway_700Bold' },
});

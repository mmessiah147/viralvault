import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    screen: 'Home',
    color: '#ff6b35',
    title: 'Your Command Center',
    description: 'The Home screen shows your live stats, AI suggestions, and upcoming posts. Tap the Edit button to customize which stats you see — just like iPhone Control Center.',
    icon: 'H',
  },
  {
    id: 2,
    screen: 'Library',
    color: '#4ecdc4',
    title: 'Your Content Library',
    description: 'Every photo and video from your connected accounts gets analyzed and grouped into thematic clusters. The AI detects your content pillars automatically.',
    icon: 'L',
  },
  {
    id: 3,
    screen: 'Create',
    color: '#a78bfa',
    title: 'AI-Powered Post Builder',
    description: 'The AI selects your besthotos, arranges them for maximum virality, and writes captions in your voice. You review and approve before anything goes live.',
    icon: 'C',
  },
  {
    id: 4,
    screen: 'Analytics',
    color: '#f9ca24',
    title: 'Growth Intelligence',
    description: 'Track weekly, monthly, and annual growth. Set follower goals and see exactly how many posts and what engagement level you need to hit them.',
    icon: 'A',
  },
  {
    id: 5,
    screen: 'Settings',
    color: '#ff6b35',
    title: 'Your Brand DNA',
    description: 'Connect Instagram, TikTok, and your photo library. Define your content pillars, set your posting cadence, and manage your subscription tier.',
    icon: 'S',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { borderTopColor: slide.color }]}>
      
      <View style={styles.skipRow}>
        <TouchableOpacity onPress={() => navigation.replace('Main')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <View style={[styles.iconCircle, { backgroundColor: slide.color + '20', borderColor: slide.color + '40' }]}>
          <Text style={[styles.iconText, { color: slide.color }]}>{slide.icon}</Text>
        </View>

        <View style={[styles.screenBadge, { backgroundColor: slide.color + '20' }]}>
          <Text style={[styles.screenBadgeText, { color: slide.color }]}>{slide.screen} Screen</Text>
        </View>

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => setCurrentSlide(index)}>
            <View style={[styles.dot, index === currentSlide && { backgroundColor: slide.color, width: 24 }]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButtons}>
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentSlide(currentSlide - 1)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: slide.color }]}
          onPress={() => isLast ? navigation.replace('Main') : setCurrentSlide(currentSlide + 1)}
        >
          <Text style={styles.nextButtonText}>{isLast ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, borderTopWidth: 3 },
  skipRow: { alignItems: 'flex-end', paddingTop: 16, marginBottom: 20 },
  skipText: { color: '#555', fontSize: 14 },
  slideContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  iconText: { fontSize: 40, fontWeight: '900' },
  screenBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  screenBadgeText: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  slideTitle: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  slideDescription: { color: '#888', fontSize: 16, textAlign: 'center', lineHeight: 26, maxWidth: 320 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
  bottomButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  backButton: { flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextButton: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

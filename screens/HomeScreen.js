import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorialOverlay from '../components/TutorialOverlay';

const { width } = Dimensions.get('window');

const PILLAR_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#FB923C'];

const STATS = [
  { label: 'Followers', value: '1,484', change: '+31', color: '#38BDF8' },
  { label: 'Weekly Growth', value: '2.4%', change: '+0.6%', color: '#34D399' },
  { label: 'Eng. Rate', value: '4.8%', change: '+0.2%', color: '#0EA5E9' },
  { label: 'Reach', value: '8.2K', change: '+1.1K', color: '#FBBF24' },
  { label: 'Saves', value: '423', change: '+87', color: '#38BDF8' },
  { label: 'Shares', value: '184', change: '+23', color: '#34D399' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function buildUpcoming(pillars, colors) {
  const days = ['Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat'];
  const types = ['Carousel', 'Reel', 'Story', 'Carousel', 'Reel'];
  const platforms = ['Instagram + TikTok', 'Instagram', 'Instagram', 'TikTok', 'Instagram + TikTok'];
  return days.map((day, i) => {
    const pillarIndex = i % pillars.length;
    return {
      id: i + 1,
      title: `${pillars[pillarIndex]} Content Drop`,
      platform: platforms[i],
      type: types[i],
      day,
      pillar: pillars[pillarIndex],
      color: colors[pillarIndex],
      photos: ['1', '2', '3', '4'],
    };
  });
}

export default function HomeScreen({ navigation }) {
  const [customizing, setCustomizing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [profile, setProfile] = useState(null);
  const [pillars, setPillars] = useState([]);
  const [pillarColors, setPillarColors] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const raw = await AsyncStorage.getItem('viralvault_profile');
      if (raw) {
        const p = JSON.parse(raw);
        setProfile(p);
        const userPillars = p.pillars || [];
        const colors = userPillars.map((_, i) => PILLAR_COLORS[i % PILLAR_COLORS.length]);
        setPillars(userPillars);
        setPillarColors(colors);
        setUpcoming(buildUpcoming(userPillars, colors));
      }
    } catch (e) {
      console.log('Error loading profile', e);
    }
  }

  const rawName = profile?.name?.split(' ')[0] || 'Creator';
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'A';
  const topPillar = pillars[0] || 'Content';
  const topColor = pillarColors[0] || '#38BDF8';

  return (
    <SafeAreaView style={styles.container}>
      <TutorialOverlay visible={showTutorial} onFinish={() => setShowTutorial(false)} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.customizeBtn} onPress={() => setCustomizing(!customizing)}>
              <Text style={styles.customizeBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pillar Badges */}
        {pillars.length > 0 && (
          <View style={styles.pillarRow}>
            {pillars.map((pillar, i) => (
              <View key={pillar} style={[styles.pillarBadge, { borderColor: pillarColors[i], backgroundColor: pillarColors[i] + '18' }]}>
                <Text style={[styles.pillarBadgeText, { color: pillarColors[i] }]}>{pillar}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Customize Panel */}
        {customizing && (
          <View style={styles.customizePanel}>
            <Text style={styles.customizePanelTitle}>Customize Dashboard</Text>
            <Text style={styles.customizePanelSub}>Tap to toggle stats visibility</Text>
            <View style={styles.customizeGrid}>
              {STATS.map((stat) => (
                <TouchableOpacity key={stat.label} style={styles.customizeItem}>
                  <Text style={styles.customizeItemText}>{stat.label}</Text>
                  <Text style={styles.customizeCheckmark}>✓</Text>
                </TouchableOpacity>
              ))}
            View>
            <TouchableOpacity style={styles.customizeDone} onPress={() => setCustomizing(false)}>
              <Text style={styles.customizeDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          </View>
        )}

        {/* AI Suggestion Card */}
        <View style={[styles.suggestionCard, { borderColor: topColor + '40' }]}>
          <View style={styles.suggestionHeader}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI SUGGESTION</Text>
            </View>
            <Text style={[styles.pillLabel, { color: topColor }]}>{topPillar}</Text>
          </View>
          <Text style={styles.suggestionTitle}>You have a post ready to build</Text>
          <Text style={styles.suggestionSubtitle}>
            Photos detected from your recent {topPillar.toLowerCase()} content. Ready to curate?
          </Text>
          <TouchableOpacity style={[styles.suggestionButton, { backgroundColor: topColor }]} onPress={() => navigation.navigate('PostEditor', { cluster: clusters.length > 0 ? clusters[0] : null })}>
            <Text style={styles.suggestionButtonText}>Build Post</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Posts */}
        <Text style={styles.sectionTitle}>Upcoming Posts</Text>
        {upcoming.map((post) => (
          <View key={post.id} style={[styles.upcomingCard, { borderLeftColor: post.color }]}>
            <View style={styles.upcomingHeader}>
              <View style={styles.upcomingLeft}>
                <Text style={styles.upcomingDay}>{post.day}</Text>
                <View style={[styles.typeBadge, { backgroundColor: post.color + '20' }]}>
                  <Text style={[styles.typeBadgeText, { color: post.color }]}>{post.type}</Text>
                </View>
              </View>
              <Text style={styles.upcomingPlatform}>{post.platform}</Text>
            </View>
            <Text style={styles.upcomingTitle}>{post.title}</Text>
            <View style={[styles.pillarTag, { backgroundColor: post.color + '15' }]}>
              <Text style={[styles.pillarTagText, { color: post.color }]}>{post.pillar}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
              {post.photos.map((photo, index) => (
                <View key={index} style={styles.photoThumb}>
                  <Text style={styles.photoThumbNum}>{index + 1}</Text>
                  {index === 0 && (
                    <View style={styles.hookTag}>
                      <Text style={styles.hookTagText}>HOOK</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 16 },
  greeting: { color: '#94A3B8', fontSize: 14 },
  name: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customizeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B' },
  customizeBtnText: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  pillarRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  pillarBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  pillarBadgeText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  customizePanel: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#38BDF830' },
  customizePanelTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  customizePanelSub: { color: '#94A3B8', fontSize: 12, marginBottom: 16 },
  customizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  customizeItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  customizeItemText: { color: '#fff', fontSize: 12 },
  customizeCheckmark: { color: '#34D399', fontSize: 12, fontWeight: '700' },
  customizeDone: { backgroundColor: '#38BDF8', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  customizeDoneText: { color: '#fff', fontWeight: '700' },
  suggestionCard: { backgroundColor: '#0F172A', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1 },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  aiBadge: { backgroundColor: '#38BDF820', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  aiBadgeText: { color: '#38BDF8', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  pillLabel: { fontSize: 12, fontWeight: '700' },
  suggestionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  suggestionSubtitle: { color: '#94A3B8', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  suggestionButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  suggestionButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '31%', backgroundColor: '#111827', borderRadius: 14, padding: 14, marginBottom: 8 },
  statChange: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  upcomingCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 14, borderLeftWidth: 3 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  upcomingDay: { color: '#fff', fontSize: 13, fontWeight: '700' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  upcomingPlatform: { color: '#94A3B8', fontSize: 11 },
  upcomingTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  pillarTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginBottom: 10 },
  pillarTagText: { fontSize: 11, fontWeight: '700' },
  photoStrip: { marginBottom: 4 },
  photoThumb: { width: 64, height: 64, backgroundColor: '#1E293B', borderRadius: 10, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  photoThumbNum: { color: '#94A3B8', fontSize: 18, fontWeight: '800' },
  hookTag: { position: 'absolute', bottom: 4, left: 4, backgroundColor: '#38BDF8', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  hookTagText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});

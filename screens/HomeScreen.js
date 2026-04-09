import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import TutorialOverlay from '../components/TutorialOverlay';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Followers', value: '1,484', change: '+31', color: '#ff6b35' },
  { label: 'Weekly Growth', value: '2.4%', change: '+0.6%', color: '#4ecdc4' },
  { label: 'Eng. Rate', value: '4.8%', change: '+0.2%', color: '#a78bfa' },
  { label: 'Reach', value: '8.2K', change: '+1.1K', color: '#f9ca24' },
  { label: 'Saves', value: '423', change: '+87', color: '#ff6b35' },
  { label: 'Shares', value: '184', change: '+23', color: '#4ecdc4' },
];

const UPCOMING = [
  { id: 1, title: 'Skydiving Journey Part 1', platform: 'Instagram + TikTok', type: 'Carousel', day: 'Tomorrow', pillar: 'Adrenaline', color: '#ff6b35', photos: ['1', '2', '3', '4'] },
  { id: 2, title: 'Prague Throwback', platform: 'Instagram', type: 'Reel', day: 'Wed', pillar: 'Travel', color: '#4ecdc4', photos: ['1', '2', '3', '4'] },
  { id: 3, title: 'Philosophy Under Pressure', platform: 'Instagram', type: 'Carousel', day: 'Thu', pillar: 'Philosophy', color: '#a78bfa', photos: ['1', '2', '3', '4'] },
  { id: 4, title: 'Switzerland Alps Adventure', platform: 'Instagram + TikTok', type: 'Reel', day: 'Sat', pillar: 'Travel', color: '#4ecdc4', photos: ['1', '2', '3', '4'] },
  { id: 5, title: 'Morning Fitness Grind', platform: 'Instagram', type: 'Story', day: 'Sun', pillar: 'Adrenaline', color: '#ff6b35', photos: ['1', '2', '3', '4'] },
];

export default function HomeScreen({ navigation }) {
  const [customizing, setCustomizing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <TutorialOverlay visible={showTutorial} onFinish={() => setShowTutorial(false)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Markus</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.customizeBtn} onPress={() => setCustomizing(!customizing)}>
              <Text style={styles.customizeBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.avatarText}>M</Text>
            </TouchableOpacity>
          </View>
        </View>

        {customizing && (
          <View style={styles.customizePanel}>
            <Text style={styles.customizePanelTitle}>Customize Dashboard</Text>
            <Text style={styles.customizePanelSub}>Tap to toggle stats visibility</Text>
            <View style={styles.customizeGrid}>
              {STATS.map((stat) => (
                <TouchableOpacity key={stat.label} style={styles.customizeItem}>
                  <Text style={styles.customizeItemText}>{stat.label}</Text>
                  <Text style={styles.customizeCheckmark}>v</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.customizeDone} onPress={() => setCustomizing(false)}>
              <Text style={styles.customizeDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI SUGGESTION</Text>
            </View>
            <Text style={styles.pillLabel}>Adrenaline</Text>
          </View>
          <Text style={styles.suggestionTitle}>You have a post ready to build</Text>
          <Text style={styles.suggestionSubtitle}>14 photos detected from your recent skydiving adventure. Ready to curate?</Text>
          <TouchableOpacity style={styles.suggestionButton} onPress={() => navigation.navigate('PostEditor')}>
            <Text style={styles.suggestionButtonText}>Build Post</Text>
          </TouchableOpacity>
        </View>

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

        <Text style={styles.sectionTitle}>Upcoming Posts</Text>
        {UPCOMING.map((post) => (
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
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 24 },
  greeting: { color: '#666', fontSize: 14 },
  name: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customizeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a1a' },
  customizeBtnText: { color: '#ff6b35', fontSize: 13, fontWeight: '700' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ff6b35', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  customizePanel: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ff6b3530' },
  customizePanelTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  customizePanelSub: { color: '#666', fontSize: 12, marginBottom: 16 },
  customizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  customizeItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2a2a2a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  customizeItemText: { color: '#fff', fontSize: 12 },
  customizeCheckmark: { color: '#4ecdc4', fontSize: 12, fontWeight: '700' },
  customizeDone: { backgroundColor: '#ff6b35', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  customizeDoneText: { color: '#fff', fontWeight: '700' },
  suggestionCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: '#ff6b3530' },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  aiBadge: { backgroundColor: '#ff6b3520', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  aiBadgeText: { color: '#ff6b35', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  pillLabel: { color: '#888', fontSize: 12 },
  suggestionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  suggestionSubtitle: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  suggestionButton: { backgroundColor: '#ff6b35', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  suggestionButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  statCard: { width: (width - 52) / 3, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14 },
  statChange: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 4 },
  upcomingCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 14, borderLeftWidth: 3 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  upcomingDay: { color: '#fff', fontSize: 13, fontWeight: '700' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  upcomingPlatform: { color: '#666', fontSize: 11 },
  upcomingTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  photoStrip: { marginBottom: 4 },
  photoThumb: { width: 64, height: 64, backgroundColor: '#2a2a2a', borderRadius: 10, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  photoThumbNum: { color: '#666', fontSize: 18, fontWeight: '800' },
  hookTag: { position: 'absolute', bottom: 4, left: 4, backgroundColor: '#ff6b35', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  hookTagText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});

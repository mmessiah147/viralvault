import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MOCK_CLUSTERS = [
  {
    id: 1,
    topic: 'Morning Routine Transformation',
    platform: 'Instagram',
    trendScore: 'High',
    estimatedReach: '84.2K',
    bestPostingTime: '6:00 AM – 8:00 AM',
    angle: 'Show the before/after of your morning in 60 seconds',
    hashtags: ['#morningroutine', '#transformation', '#lifestyle'],
  },
  {
    id: 2,
    topic: 'Behind The Lens BTS',
    platform: 'TikTok',
    trendScore: 'High',
    estimatedReach: '112K',
    bestPostingTime: '7:00 PM – 9:00 PM',
    angle: 'Raw unedited footage of your creative process',
    hashtags: ['#behindthescenes', '#contentcreator', '#bts'],
  },
  {
    id: 3,
    topic: 'Day In My Life',
    platform: 'Instagram',
    trendScore: 'Medium',
    estimatedReach: '47.8K',
    bestPostingTime: '12:00 PM – 2:00 PM',
    angle: 'One honest day — wins, fails, and everything in between',
    hashtags: ['#dayinmylife', '#vlog', '#authentic'],
  },
  {
    id: 4,
    topic: 'Fitness Progress Check',
    platform: 'TikTok',
    trendScore: 'High',
    estimatedReach: '98.3K',
    bestPostingTime: '5:00 AM – 7:00 AM',
    angle: 'Side-by-side comparison with exact routine breakdown',
    hashtags: ['#fitnessprogress', '#gymmotivation', '#bodytransformation'],
  },
  {
    id: 5,
    topic: 'Travel Hidden Gems',
    platform: 'Instagram',
    trendScore: 'Medium',
    estimatedReach: '61.1K',
    bestPostingTime: '3:00 PM – 5:00 PM',
    angle: 'Spots tourists miss — show the exact location at end',
    hashtags: ['#hiddengems', '#travelgram', '#exploremore'],
  },
  {
    id: 6,
    topic: 'Mindset Reset Tips',
    platform: 'TikTok',
    trendScore: 'Low',
    estimatedReach: '22.4K',
    bestPostingTime: '8:00 PM – 10:00 PM',
    angle: 'The one shift that changed how you handle failure',
    hashtags: ['#mindset', '#personaldevelopment', '#growthmindset'],
  },
];

const SCORE_COLORS = {
  High: '#4ecdc4',
  Medium: '#f9ca24',
  Low: '#ff6b35',
};

export default function CompetitiveIntelligenceScreen({ navigation }) {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [adopted, setAdopted] = useState([]);

  const handleAnalyze = () => {
    if (!handle.trim()) return;
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults(MOCK_CLUSTERS);
      setLoading(false);
    }, 2000);
  };

  const toggleAdopt = (id) => {
    setAdopted((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Competitive Intelligence</Text>
          <Text style={styles.subtitle}>Track what's trending in your niche</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.inputRow}>
            <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter competitor handle (@username)"
              placeholderTextColor="#555"
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.analyzeBtn, !handle.trim() && styles.analyzeBtnDisabled]}
            onPress={handleAnalyze}
            disabled={!handle.trim() || loading}
          >
            <Ionicons name="trending-up-outline" size={16} color="#fff" />
            <Text style={styles.analyzeBtnText}>Analyze</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a78bfa" />
            <Text style={styles.loadingText}>Scanning trending content...</Text>
          </View>
        )}

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>
              {results.length} Trending Clusters Found
            </Text>
            {results.map((cluster) => (
              <View key={cluster.id} style={styles.card}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTopic}>{cluster.topic}</Text>
                  <View style={styles.badges}>
                    <View style={styles.platformBadge}>
                      <Ionicons
                        name={cluster.platform === 'TikTok' ? 'musical-notes-outline' : 'camera-outline'}
                        size={11}
                        color="#fff"
                      />
                      <Text style={styles.platformText}>{cluster.platform}</Text>
                    </View>
                    <View style={[styles.scoreBadge, { backgroundColor: SCORE_COLORS[cluster.trendScore] + '22', borderColor: SCORE_COLORS[cluster.trendScore] }]}>
                      <View style={[styles.scoreDot, { backgroundColor: SCORE_COLORS[cluster.trendScore] }]} />
                      <Text style={[styles.scoreText, { color: SCORE_COLORS[cluster.trendScore] }]}>
                        {cluster.trendScore}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Ionicons name="people-outline" size={13} color="#888" />
                    <Text style={styles.statLabel}>Est. Reach</Text>
                    <Text style={styles.statValue}>{cluster.estimatedReach}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Ionicons name="time-outline" size={13} color="#888" />
                    <Text style={styles.statLabel}>Best Time</Text>
                    <Text style={styles.statValue}>{cluster.bestPostingTime}</Text>
                  </View>
                </View>

                {/* Angle */}
                <View style={styles.angleBox}>
                  <Ionicons name="bulb-outline" size={14} color="#a78bfa" />
                  <Text style={styles.angleText}>{cluster.angle}</Text>
                </View>

                {/* Hashtags */}
                <View style={styles.hashtagRow}>
                  {cluster.hashtags.map((tag) => (
                    <View key={tag} style={styles.hashtagPill}>
                      <Text style={styles.hashtagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Adopt Button */}
                <TouchableOpacity
                  style={[styles.adoptBtn, adopted.includes(cluster.id) && styles.adoptedBtn]}
                  onPress={() => toggleAdopt(cluster.id)}
                >
                  <Ionicons
                    name={adopted.includes(cluster.id) ? 'checkmark-circle' : 'add-circle-outline'}
                    size={16}
                    color={adopted.includes(cluster.id) ? '#4ecdc4' : '#a78bfa'}
                  />
                  <Text style={[styles.adoptBtnText, adopted.includes(cluster.id) && styles.adoptedBtnText]}>
                    {adopted.includes(cluster.id) ? 'Adopted ✓' : 'Adopt this angle'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="telescope-outline" size={48} color="#333" />
            <Text style={styles.emptyTitle}>No analysis yet</Text>
            <Text style={styles.emptySubtitle}>
              Enter a competitor's handle above and tap Analyze to discover trending content clusters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111111' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a1a', borderRadius: 12,
    borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, height: 48,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 14 },
  analyzeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#a78bfa', borderRadius: 12, height: 48, gap: 8,
  },
  analyzeBtnDisabled: { backgroundColor: '#333' },
  analyzeBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  loadingContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { color: '#888', fontSize: 14 },
  resultsSection: { paddingHorizontal: 20, paddingBottom: 32 },
  sectionTitle: { color: '#888', fontSize: 13, fontWeight: '600', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 16,
    borderWidth: 1, borderColor: '#222', padding: 16, marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTopic: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  badges: { flexDirection: 'row', gap: 6 },
  platformBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  platformText: { color: '#ccc', fontSize: 11, fontWeight: '500' },
  scoreBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1,
  },
  scoreDot: { width: 6, height: 6, borderRadius: 3 },
  scoreText: { fontSize: 11, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { color: '#666', fontSize: 11 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: '600' },
  statDivider: { width: 1, height: 32, backgroundColor: '#222' },
  angleBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#1e1a2e', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  angleText: { color: '#c4b5fd', fontSize: 13, flex: 1, lineHeight: 18 },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  hashtagPill: { backgroundColor: '#1f2937', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  hashtagText: { color: '#60a5fa', fontSize: 11 },
  adoptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, borderWidth: 1, borderColor: '#a78bfa', height: 40, gap: 6,
  },
  adoptedBtn: { borderColor: '#4ecdc4', backgroundColor: '#0d2420' },
  adoptBtnText: { color: '#a78bfa', fontWeight: '600', fontSize: 14 },
  adoptedBtnText: { color: '#4ecdc4' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  emptyTitle: { color: '#555', fontSize: 18, fontWeight: '600' },
  emptySubtitle: { color: '#444', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PILLAR_DATA = [
  { label: 'Adrenaline', percentage: 45, color: '#ff6b35', posts: 12 },
  { label: 'Travel', percentage: 35, color: '#4ecdc4', posts: 9 },
  { label: 'Philosophy', percentage: 20, color: '#a78bfa', posts: 5 },
];

const RECENT_POSTS = [
  { title: 'Skydiving Journey', likes: 847, saves: 123, shares: 64, growth: '+2.4%' },
  { title: 'Prague Throwback', likes: 612, saves: 98, shares: 41, growth: '+1.8%' },
  { title: 'Philosophy Under Pressure', likes: 934, saves: 201, shares: 87, growth: '+3.1%' },
];

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Last 30 days</Text>
        </View>

        {/* Top Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,484</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>+2.4%</Text>
            <Text style={styles.statLabel}>Weekly Growth</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8%</Text>
            <Text style={styles.statLabel}>Eng. Rate</Text>
          </View>
        </View>

        {/* Pillar Performance */}
        <Text style={styles.sectionTitle}>Performance by Pillar</Text>
        <View style={styles.pillarsCard}>
          {PILLAR_DATA.map((pillar) => (
            <View key={pillar.label} style={styles.pillarRow}>
              <View style={styles.pillarInfo}>
                <Text style={styles.pillarLabel}>{pillar.label}</Text>
                <Text style={styles.pillarPosts}>{pillar.posts} posts</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${pillar.percentage}%`, backgroundColor: pillar.color }]} />
              </View>
              <Text style={[styles.pillarPercent, { color: pillar.color }]}>{pillar.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Growth Target */}
        <Text style={styles.sectionTitle}>Weekly Growth Target</Text>
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <Text style={styles.targetLabel}>Target: 2-5% per week</Text>
            <Text style={styles.targetValue}>2.4% this week</Text>
          </View>
          <View style={styles.targetBarContainer}>
            <View style={styles.targetBarBg}>
              <View style={[styles.targetBarFill, { width: '48%' }]} />
            </View>
          </View>
          <Text style={styles.targetHint}>Halfway to your 5% max target 🔥</Text>
        </View>

        {/* Recent Posts */}
        <Text style={styles.sectionTitle}>Recent Post Performance</Text>
        {RECENT_POSTS.map((post) => (
          <View key={post.title} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postGrowth}>{post.growth}</Text>
            </View>
            <View style={styles.postStats}>
              <View style={styles.postStat}>
                <Text style={styles.postStatNumber}>{post.likes}</Text>
                <Text style={styles.postStatLabel}>Likes</Text>
              </View>
              <View style={styles.postStat}>
                <Text style={styles.postStatNumber}>{post.saves}</Text>
                <Text style={styles.postStatLabel}>Saves</Text>
              </View>
              <View style={styles.postStat}>
                <Text style={styles.postStatNumber}>{post.shares}</Text>
                <Text style={styles.postStatLabel}>Shares</Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#666', fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  pillarsCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 28, gap: 16 },
  pillarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pillarInfo: { width: 90 },
  pillarLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  pillarPosts: { color: '#666', fontSize: 11 },
  barContainer: { flex: 1, backgroundColor: '#2a2a2a', borderRadius: 4, height: 8 },
  bar: { height: 8, borderRadius: 4 },
  pillarPercent: { width: 36, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  targetCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 28 },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  targetLabel: { color: '#666', fontSize: 13 },
  targetValue: { color: '#ff6b35', fontSize: 13, fontWeight: '700' },
  targetBarContainer: { marginBottom: 10 },
  targetBarBg: { backgroundColor: '#2a2a2a', borderRadius: 4, height: 8 },
  targetBarFill: { backgroundColor: '#ff6b35', height: 8, borderRadius: 4 },
  targetHint: { color: '#666', fontSize: 12 },
  postCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 12 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  postTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  postGrowth: { color: '#4ecdc4', fontSize: 13, fontWeight: '700' },
  postStats: { flexDirection: 'row', gap: 24 },
  postStat: { alignItems: 'center' },
  postStatNumber: { color: '#fff', fontSize: 16, fontWeight: '800' },
  postStatLabel: { color: '#666', fontSize: 11, marginTop: 2 },
});
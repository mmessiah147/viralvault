import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PILLAR_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];

const PERIODS = ['7 days', '30 days', '90 days'];

export default function AnalyticsScreen() {
  const [profile, setProfile] = useState(null);
  const [activePeriod, setActivePeriod] = useState('30 days');

  useEffect(() => {
    AsyncStorage.getItem('viralvault_profile').then(raw => {
      if (raw) setProfile(JSON.parse(raw));
    });
  }, []);

  const pillars = profile?.pillars || ['Content', 'Lifestyle', 'Growth'];
  const pillarData = pillars.map((p, i) => ({
    label: p,
    color: PILLAR_COLORS[i % PILLAR_COLORS.length],
    percentage: [45, 35, 20][i] || 20,
    posts: [12, 9, 5][i] || 4,
    engagement: ['4.8%', '3.2%', '5.1%'][i] || '3.0%',
  }));

  const recentPosts = pillars.map((p, i) => ({
    title: `${p} — Top Post`,
    pillar: p,
    color: PILLAR_COLORS[i % PILLAR_COLORS.length],
    likes: [847, 612, 934][i] || 400,
    saves: [123, 98, 201][i] || 80,
    shares: [64, 41, 87][i] || 30,
    growth: ['+2.4%', '+1.8%', '+3.1%'][i] || '+1.5%',
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, activePeriod === p && styles.periodBtnActive]}
                onPress={() => setActivePeriod(p)}
              >
                <Text style={[styles.periodText, activePeriod === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Stats */}
        <View style={styles.statsGrid}>
          {[
            { value: '1,484', label: 'Followers', color: '#38BDF8', change: '+31' },
            { value: '2.4%', label: 'Weekly Growth', color: '#34D399', change: '+0.6%' },
            { value: '4.8%', label: 'Eng. Rate', color: '#FBBF24', change: '+0.2%' },
            { value: '8.2K', label: 'Reach', color: '#A78BFA', change: '+1.1K' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Pillar Performance */}
        <Text style={styles.sectionTitle}>Performance by Pillar</Text>
        <View style={styles.card}>
          {pillarData.map((pillar, i) => (
            <View key={pillar.label}>
              <View style={styles.pillarRow}>
                <View style={styles.pillarInfo}>
                  <Text style={styles.pillarLabel}>{pillar.label.split(' ')[0]}</Text>
                  <Text style={styles.pillarPosts}>{pillar.posts} posts · {pillar.engagement}</Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: pillar.percentage + '%', backgroundColor: pillar.color }]} />
                </View>
                <Text style={[styles.pillarPercent, { color: pillar.color }]}>{pillar.percentage}%</Text>
              </View>
              {i < pillarData.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Growth Target */}
        <Text style={styles.sectionTitle}>Weekly Growth Target</Text>
        <View style={styles.card}>
          <View style={styles.targetHeaer}>
            <Text style={styles.targetLabel}>Target: 2–5% per week</Text>
            <Text style={styles.targetValue}>2.4% this week</Text>
          </View>
          <View style={styles.targetBarBg}>
            <View style={[styles.targetBarFill, { width: '48%' }]} />
          </View>
          <Text style={styles.targetHint}>Halfway to your 5% max target 🔥</Text>
        </View>

        {/* Best Performing Pillar */}
        <Text style={styles.sectionTitle}>Pillar Spotlight</Text>
        <View style={[styles.spotlightCard, { borderColor: pillarData[0]?.color + '40' }]}>
          <View style={[styles.spotlightBadge, { backgroundColor: pillarData[0]?.color + '20' }]}>
            <Text style={[styles.spotlightBadgeText, { color: pillarData[0]?.color }]}>TOP PILLAR</Text>
          </View>
          <Text style={styles.spotlightTitle}>{pillarData[0]?.label}</Text>
          <Text style={styles.spotlightSub}>Your {pillarData[0]?.label} content drives {pillarData[0]?.percentage}% of totngagement. Posts in this pillar average {pillarData[0]?.engagement} engagement rate.</Text>
          <View style={styles.spotlightStats}>
            <View style={styles.spotlightStat}>
              <Text style={[styles.spotlightStatNum, { color: pillarData[0]?.color }]}>{pillarData[0]?.posts}</Text>
              <Text style={styles.spotlightStatLabel}>Posts</Text>
            </View>
            <View style={styles.spotlightStat}>
              <Text style={[styles.spotlightStatNum, { color: pillarData[0]?.color }]}>{pillarData[0]?.engagement}</Text>
              <Text style={styles.spotlightStatLabel}>Avg Eng.</Text>
            </View>
            <View style={styles.spotlightStat}>
              <Text style={[styles.spotlightStatNum, { color: pillarData[0]?.color }]}>{pillarData[0]?.percentage}%</Text>
              <Text style={styles.spotlightStatLabel}>Share</Text>
            </View>
          </View>
        </View>

        {/* Recent Posts */}
        <Text style={styles.sectionTitle}>Recent Post Performance</Text>
        {recentPosts.map((post) => (
          <View key={post.title} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={[styles.pillarTag, { backgroundColor: post.color + '18' }]}>
                  <Text style={[styles.pillarTagText, { color: post.color }]}>{post.pillar.split(' ')[0]}</Text>
                </View>
              </View>
              <Text style={styles.postGrowth}>{post.growth}</Text>
            </View>
            <View style={styles.postStats}>
              {[{ n: post.likes, l: 'Likes' }, { n: post.saves, l: 'Saves' }, { n: post.shares, l: 'Shares' }].map(s => (
                <View key={s.l} style={styles.postStat}>
                  <Text style={styles.postStatNumber}>{s.n}</Text>
                  <Text style={styles.postStatLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E', paddingHorizontal: 20 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: { color: '#F1F5F9', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1E293B' },
  periodBtnActive: { backgroundColor: '#38BDF820', borderColor: '#38BDF8' },
  periodText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  periodTextActive: { color: '#38BDF8' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#111827', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E293B' },
  statChange: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  statNumber: { color: '#F1F5F9', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  sectionTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  card: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#1E293B' },
  pillarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  pillarInfo: { width: 90 },
  pillarLabel: { color: '#F1F5F9', fontSize: 13, fontWeight: '600' },
  pillarPosts: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  barContainer: { flex: 1, backgroundColor: '#1E293B', borderRadius: 4, height: 8 },
  bar: { height: 8, borderRadius: 4 },
  pillarPercent: { width: 36, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#1E293B' },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  targetLabel: { color: '#94A3B8', fontSize: 13 },
  targetValue: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  targetBarBg: { backgroundColor: '#1E293B', borderRadius: 4, height: 8, marginBottom: 10 },
  targetBarFill: { backgroundColor: '#38BDF8', height: 8, borderRadius: 4 },
  targetHint: { color: '#94A3B8', fontSize: 12 },
  spotlightCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1 },
  spotlightBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 },
  spotlightBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  spotlightTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  spotlightSub: { color: '#94A3B8', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  spotlightStats: { flexDirection: 'row', gap: 24 },
  spotlightStat: { alignItems: 'center' },
  spotlightStatNum: { fontSize: 20, fontWeight: '900' },
  spotlightStatLabel: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  postCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1E293B' },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  postTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  pillarTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  pillarTagText: { fontSize: 10, fontWeight: '700' },
  postGrowth: { color: '#34D399', fontSize: 13, fontWeight: '700' },
  postStats: { flexDirection: 'row', gap: 24 },
  postStat: { alignItems: 'center' },
  postStatNumber: { color: '#F1F5F9', fontSize: 16, fontWeight: '800' },
  postStatLabel: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
});

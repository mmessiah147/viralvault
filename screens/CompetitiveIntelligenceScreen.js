import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const SCORE_COLORS = { High: '#34D399', Medium: '#FBBF24', Low: '#38BDF8' };

async function analyzeWithAI(handle) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: `You are a social media strategist. Generate 6 trending content cluster ideas for a creator with the handle "${handle}". Infer their niche from the handle name. Respond ONLY with a JSON array of 6 objects, no other text, no markdown. Each object must have exactly these fields: topic (string), platform (Instagram or TikTok), trendScore (High/Medium/Low), estimatedReach (string like "124K"), bestPostingTime (string like "6PM - 8PM"), angle (string, one actionable sentence), hashtags (array of 2 strings).` }],
    }),
  });
  const data = await response.json();
  const text = data?.content?.[0]?.text?.trim() || '[]';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export default function CompetitiveIntelligenceScreen() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [adopted, setAdopted] = useState([]);
  const [searchedHandle, setSearchedHandle] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!handle.trim()) return;
    setLoading(true); setResults([]); setError(''); setSearchedHandle(handle.trim());
    try {
      const clusters = await analyzeWithAI(handle.trim());
      setResults(clusters.map((c, i) => ({ ...c, id: i + 1 })));
    } catch (e) { setError('Could not analyze. Check your connection and try again.'); }
    finally { setLoading(false); }
  };

  const toggleAdopt = (id) => setAdopted(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Intel</Text>
          <Text style={styles.subtitle}>Discover what is trending in any niche</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.inputRow}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput style={styles.input} placeholder="Enter any creator handle (@username)" placeholderTextColor="#334155" value={handle} onChangeText={setHandle} autoCapitalize="none" autoCorrect={false} onSubmitEditing={handleAnalyze} />
            {handle.length > 0 && <TouchableOpacity onPress={() => { setHandle(''); setResults([]); }}><Ionicons name="close-circle" size={18} color="#334155" /></TouchableOpacity>}
          </View>
          <TouchableOpacity style={[styles.analyzeBtn, !handle.trim() && styles.analyzeBtnDisabled]} onPress={handleAnalyze} disabled={loading || !handle.trim()}>
            <Ionicons name="trending-up-outline" size={16} color={handle.trim() ? '#0A0F1E' : '#334155'} />
            <Text style={[styles.analyzeBtnText, !handle.trim() && styles.analyzeBtnTextDisabled]}>Analyze with AI</Text>
          </TouchableOpacity>
        </View>
        {loading && <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#38BDF8" /><Text style={styles.loadingText}>AI scanning clusters for {searchedHandle}...</Text></View>}
        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>{results.length} Clusters Found</Text>
              <Text style={styles.sectionHandle}>{searchedHandle}</Text>
            </View>
            {results.map(cluster => (
              <View key={cluster.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTopic}>{cluster.topic}</Text>
                  <View style={styles.badges}>
                    <View style={styles.platformBadge}><Text style={styles.platformText}>{cluster.platform}</Text></View>
                    <View style={[styles.scoreBadge, { borderColor: SCORE_COLORS[cluster.trendScore] + '80' }]}><Text style={[styles.scoreText, { color: SCORE_COLORS[cluster.trendScore] }]}>{cluster.trendScore}</Text></View>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.stat}><Ionicons name="people-outline" size={13} color="#94A3B8" /><Text style={styles.statLabel}>Est. Reach</Text><Text style={styles.statValue}>{cluster.estimatedReach}</Text></View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}><Ionicons name="time-outline" size={13} color="#94A3B8" /><Text style={styles.statLabel}>Best Time</Text><Text style={styles.statValue}>{cluster.bestPostingTime}</Text></View>
                </View>
                <View style={styles.angleBox}><Ionicons name="bulb-outline" size={14} color="#38BDF8" /><Text style={styles.angleText}>{cluster.angle}</Text></View>
                <View style={styles.hashtagRow}>{(cluster.hashtags || []).map(tag => <View key={tag} style={styles.hashtagPill}><Text style={styles.hashtagText}>{tag}</Text></View>)}</View>
                <TouchableOpacity style={[styles.adoptBtn, adopted.includes(cluster.id) && styles.adoptedBtn]} onPress={() => toggleAdopt(cluster.id)}>
                  <Ionicons name={adopted.includes(cluster.id) ? 'checkmark-circle' : 'add-circle-outline'} size={16} color={adopted.includes(cluster.id) ? '#34D399' : '#38BDF8'} />
                  <Text style={[styles.adoptBtnText, adopted.includes(cluster.id) && styles.adoptedBtnText]}>{adopted.includes(cluster.id) ? 'Adopted to Strategy' : 'Adopt this angle'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {!loading && results.length === 0 && !error && (
          <View style={styles.emptyState}>
            <Ionicons name="telescope-outline" size={56} color="#1E293B" />
            <Text style={styles.emptyTitle}>No analysis yet</Text>
            <Text style={styles.emptySubtitle}>Enter any creator handle and Atlas AI will surface trending clusters, best posting times, and angles you can adopt.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#F1F5F9' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', paddingHorizontal: 14, height: 52 },
  input: { flex: 1, color: '#F1F5F9', fontSize: 14 },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#38BDF8', borderRadius: 12, height: 52, gap: 8 },
  analyzeBtnDisabled: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1E293B' },
  analyzeBtnText: { color: '#0A0F1E', fontWeight: '700', fontSize: 15 },
  analyzeBtnTextDisabled: { color: '#334155' },
  loadingContainer: { alignItems: 'center', paddingVertical: 40, gap: 14 },
  loadingText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  errorBox: { marginHorizontal: 20, backgroundColor: '#ff000020', borderRadius: 12, padding: 14 },
  errorText: { color: '#ff6b6b', fontSize: 13 },
  resultsSection: { paddingHorizontal: 20, paddingBottom: 32 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: '700' },
  sectionHandle: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: '#111827', borderRadius: 16, borderWidth: 1, borderColor: '#1E293B', padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTopic: { color: '#F1F5F9', fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  badges: { flexDirection: 'row', gap: 6 },
  platformBadge: { backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  platformText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  scoreBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  scoreText: { fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A0F1E', borderRadius: 10, padding: 12, marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { color: '#94A3B8', fontSize: 11 },
  statValue: { color: '#F1F5F9', fontSize: 13, fontWeight: '700' },
  statDivider: { width: 1, height: 32, backgroundColor: '#1E293B' },
  angleBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#38BDF820' },
  angleText: { color: '#94A3B8', fontSize: 13, flex: 1, lineHeight: 20 },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  hashtagPill: { backgroundColor: '#1E293B', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  hashtagText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
  adoptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#38BDF8', height: 42, gap: 6 },
  adoptedBtn: { borderColor: '#34D399', backgroundColor: '#34D39910' },
  adoptBtnText: { color: '#38BDF8', fontWeight: '700', fontSize: 14 },
  adoptedBtnText: { color: '#34D399' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 14 },
  emptyTitle: { color: '#94A3B8', fontSize: 18, fontWeight: '700' },
  emptySubtitle: { color: '#334155', fontSize: 13, textAlign: 'center', lineHeight: 22 },
});

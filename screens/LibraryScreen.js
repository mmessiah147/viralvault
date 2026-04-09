import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

const FILTERS = ['All', 'Adrenaline', 'Travel', 'Philosophy'];

const MOCK_CONTENT = [
  { id: 1, pillar: 'Adrenaline', theme: 'Skydiving', count: 14, color: '#ff6b35', icon: 'SK' },
  { id: 2, pillar: 'Travel', theme: 'Prague', count: 8, color: '#4ecdc4', icon: 'PR' },
  { id: 3, pillar: 'Philosophy', theme: 'Lessons Learned', count: 6, color: '#a78bfa', icon: 'PH' },
  { id: 4, pillar: 'Adrenaline', theme: 'Scuba Diving', count: 11, color: '#ff6b35', icon: 'SC' },
  { id: 5, pillar: 'Travel', theme: 'Paris', count: 9, color: '#4ecdc4', icon: 'PA' },
  { id: 6, pillar: 'Adrenaline', theme: 'Flying', count: 7, color: '#ff6b35', icon: 'FL' },
  { id: 7, pillar: 'Travel', theme: 'Switzerland', count: 12, color: '#4ecdc4', icon: 'SW' },
  { id: 8, pillar: 'Philosophy', theme: 'Fitness Journey', count: 5, color: '#a78bfa', icon: 'FT' },
  { id: 9, pillar: 'Travel', theme: 'Croatia', count: 10, color: '#4ecdc4', icon: 'CR' },
  { id: 10, pillar: 'Travel', theme: 'Iceland', count: 8, color: '#4ecdc4', icon: 'IC' },
  { id: 11, pillar: 'Adrenaline', theme: 'Base Jumping', count: 4, color: '#ff6b35', icon: 'BJ' },
  { id: 12, pillar: 'Philosophy', theme: 'Morning Routine', count: 9, color: '#a78bfa', icon: 'MR' },
];

export default function LibraryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? MOCK_CONTENT
    : MOCK_CONTENT.filter(item => item.pillar === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Library</Text>
        <Text style={styles.subtitle}>{filtered.length} clusters detected</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filtered.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.card, { borderColor: item.color + '40' }]}>
              <View style={[styles.cardIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.cardIconText, { color: item.color }]}>{item.icon}</Text>
              </View>
              <Text style={styles.cardTheme}>{item.theme}</Text>
              <Text style={styles.cardCount}>{item.count} items</Text>
              <View style={styles.cardFooter}>
                <View style={[styles.cardPill, { backgroundColor: item.color + '20' }]}>
                  <Text style={[styles.cardPillText, { color: item.color }]}>{item.pillar}</Text>
                </View>
                <Text style={styles.cardArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 20, marginBottom: 16, paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#666', fontSize: 14, marginTop: 4 },
  filterRow: { marginBottom: 20, paddingHorizontal: 20 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterPill: { paddingHorizontal: 18, pdingVertical: 9, borderRadius: 20, backgroundColor: '#1a1a1a' },
  filterPillActive: { backgroundColor: '#ff6b35' },
  filterText: { color: '#666', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  card: {
    width: CARD_SIZE,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardIconText: { fontSize: 16, fontWeight: '800' },
  cardTheme: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardCount: { color: '#666', fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cardPillText: { fontSize: 11, fontWeight: '700' },
  cardArrow: { color: '#555', fontSize: 16 },
  bottomPad: { height: 40 },
});

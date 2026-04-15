import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;
const PILLAR_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#FB923C'];
const BATCH_SIZE = 8;

async function classifyBatchWithAI(assets, pillars) {
  const results = [];
  for (const asset of assets) {
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 50,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
              },
              {
                type: 'text',
                text: `Look at this photo and respond with ONLY one of these exact labels, nothing else: ${pillars.join(', ')}. Pick the label that best describes the content of this photo.`,
              },
            ],
          }],
        }),
      });
      const data = await response.json();
      const label = data?.content?.[0]?.text?.trim() || pillars[0];
      const matched = pillars.find(p => label.toLowerCase().includes(p.toLowerCase())) || pillars[0];
      results.push({ asset, pillar: matched });
    } catch (e) {
      results.push({ asset, pillar: pillars[0] });
    }
  }
  return results;
}

export default function LibraryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [photos, setPhotos] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const cancelRef = useRef(false);

  useEffect(() => {
    loadProfile();
    checkPermission();
  }, []);

  const loadProfile = async () => {
    const p = await AsyncStorage.getItem('viralvault_profile');
    if (p) setProfile(JSON.parse(p));
  };

  const checkPermission = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      const saved = await AsyncStorage.getItem('viralvault_clusters');
      if (saved) setClusters(JSON.parse(saved));
    }
  };

  const requestPermissionAndScan = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Atlas AI needs access to your photos to analyze and cluster your content.');
      return;
    }
    setPermissionGranted(true);
    startScan();
  };

  const startScan = async () => {
    setScanning(true);
    setScanProgress(0);
    setClusters([]);
    cancelRef.current = false;

    try {
      const raw = await AsyncStorage.getItem('viralvault_profile');
      const userProfile = raw ? JSON.parse(raw) : null;
      const pillars = userProfile?.pillars || ['General'];
      const colors = pillars.map((_, i) => PILLAR_COLORS[i % PILLAR_COLORS.length]);

      setScanStatus('Loading your camera roll...');
      let allAssets = [];
      let after = null;
      let hasMore = true;

      while (hasMore && allAssets.length < 300) {
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: ['photo'],
          first: 100,
          after,
          sortBy: MediaLibrary.SortBy.creationTime,
        });
        allAssets = [...allAssets, ...result.assets];
        hasMore = result.hasNextPage;
        after = result.endCursor;
      }

      setPhotos(allAssets);
      const sample = allAssets.slice(0, 80);

      const clusterMap = {};
      pillars.forEach((pillar, i) => {
        clusterMap[pillar] = { id: i + 1, pillar, count: 0, color: colors[i], assets: [] };
      });

      const batches = [];
      for (let i = 0; i < sample.length; i += BATCH_SIZE) {
        batches.push(sample.slice(i, i + BATCH_SIZE));
      }

      for (let b = 0; b < batches.length; b++) {
        if (cancelRef.current) break;
        setScanStatus(`AI analyzing batch ${b + 1} of ${batches.length}...`);
        setScanProgress(Math.round(((b) / batches.length) * 100));

        const batchResults = await classifyBatchWithAI(batches[b], pillars);
        for (const { asset, pillar } of batchResults) {
          if (clusterMap[pillar]) {
            clusterMap[pillar].count++;
            clusterMap[pillar].assets.push(asset);
          }
        }

        const interim = Object.values(clusterMap).filter(c => c.count > 0);
        setClusters([...interim]);
      }

      setScanProgress(100);
      setScanStatus('Done!');
      const finalClusters = Object.values(clusterMap).filter(c => c.count > 0);
      setClusters(finalClusters);
      await AsyncStorage.setItem('viralvault_clusters', JSON.stringify(finalClusters));
    } catch (e) {
      console.error('Scan error:', e);
      Alert.alert('Scan Error', 'Something went wrong. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const filters = ['All', ...(profile?.pillars || [])];
  const filtered = activeFilter === 'All' ? clusters : clusters.filter(c => c.pillar === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Content Library</Text>
          <Text style={styles.subtitle}>
            {photos.length > 0 ? `${photos.length} photos analyzed` : 'Scan your camera roll to get started'}
          </Text>
        </View>

        {clusters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>AI Content Clustering</Text>
            <Text style={styles.emptyText}>
              Atlas AI will analyze up to 80 of your most recent photos using computer vision and group them by your content pillars automatically.
            </Text>
            {scanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#38BDF8" />
                <Text style={styles.scanningText}>{scanStatus}</Text>
                <View style={styles.progreBar}>
                  <View style={[styles.progressFill, { width: scanProgress + '%' }]} />
                </View>
                <Text style={styles.progressPct}>{scanProgress}%</Text>
                <TouchableOpacity onPress={() => { cancelRef.current = true; setScanning(false); }}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.scanBtn} onPress={requestPermissionAndScan}>
                <Text style={styles.scanBtnText}>✦ Scan with AI</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {filters.map(f => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterBtn, activeFilter === f &styles.filterBtnActive]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{photos.length}</Text>
                <Text style={styles.statLabel}>Total Photos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{clusters.length}</Text>
                <Text style={styles.statLabel}>Clusters</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{clusters.reduce((a, c) => a + c.count, 0)}</Text>
                <Text style={styles.statLabel}>Sorted</Text>
              </View>
            </View>

            {scanning && (
              <View style={styles.rescanningBanner}>
                <ActivityIndicator size="small" color="#38BDF8" />
                <Text style={styles.rescanningText}>{scanStatus} — {scanProgress}%</Text>
              </View>
            )}

            <View style={styles.grid}>
              {filtered.map(cluster => (
                <TouchableOpacity
                  key={cluster.id}
                  style={[styles.card, { borderColor: cluster.color + '40' }]}
                  onPress={() => navigation.navigate('PostEditor', { cluster })}
                >
                  {cluster.assets && cluster.assets[0] ? (
                    <Image source={{ uri: cluster.assets[0].uri }} style={styles.cardImage} />
                  ) : (
                    <View style={[styles.cardPlaceholder, { backgroundColor: cluster.color + '20' }]}>
                      <Text style={[styles.cardIcon, { color: cluster.color }]}>
                        {cluster.pillar.substring(0, 2).tpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.cardOverlay}>
                    <View style={[styles.pillarBadge, { backgroundColor: cluster.color }]}>
                      <Text style={styles.pillarBadgeText}>{cluster.pillar.split(' ')[0]}</Text>
                    </View>
                    <Text style={styles.cardTheme}>{cluster.pillar}</Text>
                    <Text style={styles.cardCount}>{cluster.count} photos</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.rescanBtn} onPress={startScan} disabled={scanning}>
              <Text style={styles.rescanBtnText}>{scanning ? 'Scanning...' : 'Rescan with AI'}</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 60, gap: 16 },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { color: '#F1F5F9', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 15, textAlign: 'center', lineHeight: 24 },
  scanBtn: { backgroundColor: '#38BDF8', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14, marginTop: 8 },
  scanBtnText: { color: '#0A0F1E', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  scanningContainer: { alignItems: 'center', gap: 12, width: '100%', marginTop: 8 },
  scanningText: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
  progressBar: { width: '100%', height: 6, backgroundColor: '#1E293B', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#38BDF8', borderRadius: 3 },
  progressPct: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  cancelText: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  filterRow: { paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1E293B' },
  filterBtnActive: { backgroundColor: '#38BDF820', borderColor: '#38BDF8' },
  filterText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#38BDF8' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#111827', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  statValue: { color: '#F1F5F9', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  rescanningBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, backgroundColor: '#111827', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#38BDF830' },
  rescanningText: { color: '#94A3B8', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  card: { width: CARD_SIZE, borderRadius: 16, overflow: 'hidden', borderWidth: 1, backgroundColor: '#111827' },
  cardImage: { width: '100%', height: CARD_SIZE, resizeMode: 'cover' },
  cardPlaceholder: { width: '100%', height: CARD_SIZE, alignItems: 'center', justifyContent: 'center' },
  cardIcon: { fontSize: 36, fontWeight: '900' },
  cardOverlay: { padding: 12, gap: 4 },
  pillarBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  pillarBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardTheme: { color: '#F1F5F9', fontSize: 14, fontWeight: '700' },
  cardCount: { color: '#94A3B8', fontSize: 12 },
  rescanBtn: { marginHorizontal: 20, marginBottom: 32, backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  rescanBtnText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
});

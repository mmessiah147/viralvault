import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const PLATFORMS = [
  { id: 1, name: 'Instagram', handle: '@markus_messiah', connected: true },
  { id: 2, name: 'Instagram', handle: '@markus_adventures', connected: false },
  { id: 3, name: 'TikTok', handle: '@markus_messiah', connected: true },
];

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoPost, setAutoPost] = useState(false);
  const [twoDay, setTwoDay] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Markus Messiah</Text>
            <Text style={styles.profileHandle}>@markus_messiah</Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Connected Platforms</Text>
        <View style={styles.sectionCard}>
          {PLATFORMS.map((platform, index) => (
            <View key={platform.id}>
              <View style={styles.platformRow}>
                <View style={[styles.platformIconBox, { backgroundColor: platform.name === 'Instagram' ? '#e1306c20' : '#00f2ea20' }]}>
                  <Text style={[styles.platformIconText, { color: platform.name === 'Instagram' ? '#e1306c' : '#00f2ea' }]}>
                    {platform.name === 'Instagram' ? 'IG' : 'TT'}
                  </Text>
                </View>
                <View style={styles.platformInfo}>
                  <Text style={styles.platformName}>{platform.name}</Text>
                  <Text style={styles.platformHandle}>{platform.handle}</Text>
                </View>
                {platform.connected ? (
                  <View style={styles.connectedBadge}>
                    <Text style={styles.connectedText}>Connected</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.connectButton}>
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                )}
              </View>
              {index < PLATFORMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          <TouchableOpacity style={styles.addAccountBtn}>
            <Text style={styles.addAccountText}>+ Add Another Account</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Content Pillars</Text>
        <View style={styles.sectionCard}>
          {[
            { label: 'Adrenaline and Training', color: '#ff6b35' },
            { label: 'Philosophy Under Pressure', color: '#a78bfa' },
            { label: 'Nomadic Travel', color: '#4ecdc4' },
          ].map((pillar, index, arr) => (
            <View key={pillar.label}>
              <View style={styles.pillarRow}>
                <View style={[styles.pillarDot, { backgroundColor: pillar.color }]} />
                <Text style={styles.pillarLabel}>{pillar.label}</Text>
                <View style={[styles.activePill, { backgroundColor: pillar.color + '20' }]}>
                  <Text style={[styles.activePillText, { color: pillar.color }]}>Active</Text>
                </View>
              </View>
              {index < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          <TouchableOpacity style={styles.editPillarsBtn}>
            <Text style={styles.editPillarsBtnText}>Edit Pillars</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Posting Preferences</Text>
        <View style={styles.sectionCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>AI Notifications</Text>
              <Text style={styles.toggleSub}>Alert when post is ready</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#333', true: '#ff6b35' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Auto-Post</Text>
              <Text style={styles.toggleSub}>Publish without approval</Text>
            </View>
            <Switch value={autoPost} onValueChange={setAutoPost} trackColor={{ false: '#333', true: '#ff6b35' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>2-3 Day Cadence</Text>
              <Text style={styles.toggleSub}>Recommended posting rhythm</Text>
            </View>
            <Switch value={twoDay} onValueChange={setTwoDay} trackColor={{ false: '#333', true: '#ff6b35' }} thumbColor="#fff" />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text style={styles.subscriptionTier}>Pro Plan</Text>
              <Text style={styles.subscriptionFeatures}>Carousels, Reels, Stories, Both Platforms, Full Analytics</Text>
            </View>
            <Text style={styles.subscriptionPrice}>$19/mo</Text>
          </View>
          <View style={styles.tierRow}>
            {['Free', 'Pro', 'Creator'].map((t) => (
              <View key={t} style={[styles.tierBadge, t === 'Pro' && styles.tierBadgeActive]}>
                <Text style={[styles.tierBadgeText, t === 'Pro' && styles.tierBadgeTextActive]}>{t}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Creator</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  profileCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#ff6b35', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  profileHandle: { color: '#666', fontSize: 13, marginTop: 2 },
  proBadge: { backgroundColor: '#ff6b3520', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  proBadgeText: { color: '#ff6b35', fontSize: 11, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sectionCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 28 },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  platformIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  platformIconText: { fontSize: 12, fontWeight: '800' },
  platformInfo: { flex: 1 },
  platformName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  platformHandle: { color: '#666', fontSize: 12, marginTop: 2 },
  connectedBadge: { backgroundColor: '#4ecdc420', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  connectedText: { color: '#4ecdc4', fontSize: 11, fontWeight: '700' },
  connectButton: { backgroundColor: '#ff6b35', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  connectButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  addAccountBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ff6b35', borderStyle: 'dashed', alignItems: 'center' },
  addAccountText: { color: '#ff6b35', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2a2a2a', marginVertical: 4 },
  pillarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  pillarDot: { width: 10, height: 10, borderRadius: 5 },
  pillarLabel: { flex: 1, color: '#fff', fontSize: 14 },
  activePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  activePillText: { fontSize: 11, fontWeight: '700' },
  editPillarsBtn: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  editPillarsBtnText: { color: '#ff6b35', fontSize: 14, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  toggleInfo: { flex: 1, marginRight: 12 },
  toggleLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  toggleSub: { color: '#666', fontSize: 12, marginTop: 2 },
  subscriptionCard: { backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ff6b3530' },
  subscriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  subscriptionTier: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  subscriptionFeatures: { color: '#666', fontSize: 12, lineHeight: 18, maxWidth: 220 },
  subscriptionPrice: { color: '#ff6b35', fontSize: 22, fontWeight: '900' },
  tierRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tierBadge: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#2a2a2a', alignItems: 'center' },
  tierBadgeActive: { backgroundColor: '#ff6b35' },
  tierBadgeText: { color: '#666', fontSize: 12, fontWeight: '600' },
  tierBadgeTextActive: { color: '#fff' },
  upgradeButton: { backgroundColor: '#ff6b35', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  upgradeButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  signOutButton: { paddingVertical: 16, alignItems: 'center', marginBottom: 40 },
  signOutText: { color: '#666', fontSize: 15 },
});
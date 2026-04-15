import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PILLAR_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];

export default function SettingsScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [autoPost, setAutoPost] = useState(false);
  const [twoDay, setTwoDay] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('viralvault_profile');
    if (raw) setProfile(JSON.parse(raw));
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.multiRemove(['atlas_token', 'viralvault_profile', 'viralvault_clusters']);
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }},
    ]);
  };

  const name = profile?.name || 'Creator';
  const handle = profile?.handle ? '@' + profile.handle : '@handle';
  const pillars = profile?.pillars || [];
  const platform = profile?.platform || 'Instagram';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileHandle}>{handle}</Text>
            <Text style={styles.profilePlatform}>{platform}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('ProfileSetup')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Content Pillars</Text>
        <View style={styles.sectionCard}>
          {pillars.length > 0 ? pillars.map((pillar, index) => (
            <View key={pillar}>
              <View style={styles.pillarRow}>
                <View style={[styles.pillarDot, { backgroundColor: PILLAR_COLORS[index % PILLAR_COLORS.length] }]} />
                <Text style={styles.pillarLabel}>{pillar}</Text>
                <View style={[styles.activePill, { backgroundColor: PILLAR_COLORS[index % PILLAR_COLORS.length] + '20' }]}>
                  <Text style={[styles.activePillText, { color: PILLAR_COLORS[index % PILLAR_COLORS.length] }]}>Active</Text>
                </View>
              </View>
              {index < pillars.length - 1 && <View style={styles.divider} />}
            </View>
          )) : (
            <Text style={styles.emptyText}>No pillars set. Edit your profile to add them.</Text>
          )}
          <TouchableOpacity style={styles.editPillarsBtn} onPress={() => navigation.navigate('ProfileSetup')}>
            <Text style={styles.editPillarsBtnText}>Edit Pillars</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Connected Platforms</Text>
        <View style={styles.sectionCard}>
          <View style={styles.platformRow}>
            <View style={styles.platformIconBox}>
              <Text style={styles.platformIconText}>IG</Text>
            </View>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>Instagram</Text>
              <Text style={styles.platformHandle}>{handle}</Text>
            </View>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.addAccountBtn}>
            <Text style={styles.addAccountText}>+ Connect TikTok</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>AI Notifications</Text>
              <Text style={styles.toggleSub}>Alert when post is ready to build</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#1E293B', true: '#38BDF8' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Auto-Post</Text>
              <Text style={styles.toggleSub}>Publish without approval</Text>
            </View>
            <Switch value={autoPost} onValueChange={setAutoPost} trackColor={{ false: '#1E293B', true: '#38BDF8' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>2-3 Day Cadence</Text>
              <Text style={styles.toggleSub}>Recommended posting rhythm</Text>
            </View>
            <Switch value={twoDay} onValueChange={setTwoDay} trackColor={{ false: '#1E293B', true: '#38BDF8' }} thumbColor="#fff" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text style={styles.subscriptionTier}>Pro Plan</Text>
              <Text style={styles.subscriptionFeatures}>Carousels · Reels · Stories · Full Analytics</Text>
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

        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.legalRow} onPress={() => Linking.openURL('https://pvlabs.base44.app/privacy')}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Text style={styles.legalArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.legalRow} onPress={() => Linking.openURL('https://pvlabs.base44.app/terms')}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Text style={styles.legalArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.legalRow}>
            <Text style={styles.legalText}>Version</Text>
            <Text style={styles.legalVersion}>1.0.0 · Atlas.ai by PV Labs</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E', paddingHorizontal: 20 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: { color: '#F1F5F9', fontSize: 28, fontWeight: '800' },
  profileCard: { backgroundColor: '#111827', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 14, borderWidth: 1, borderColor: '#1E293B' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { color: '#F1F5F9', fontSize: 16, fontWeight: '700' },
  profileHandle: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  profilePlatform: { color: '#38BDF8', fontSize: 11, marginTop: 3, fontWeight: '600' },
  editBtn: { backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  editBtnText: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  sectionTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sectionCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#1E293B' },
  emptyText: { color: '#94A3B8', fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  pillarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  pillarDot: { width: 10, height: 10, borderRadius: 5 },
  pillarLabel: { flex: 1, color: '#F1F5F9', fontSize: 14 },
  activePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  activePillText: { fontSize: 11, fontWeight: '700' },
  editPillarsBtn: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  editPillarsBtnText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  platformIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e1306c20', alignItems: 'center', justifyContent: 'center' },
  platformIconText: { fontSize: 12, fontWeight: '800', color: '#e1306c' },
  platformInfo: { flex: 1 },
  platformName: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  platformHandle: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  connectedBadge: { backgroundColor: '#34D39920', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  connectedText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  addAccountBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#38BDF8', borderStyle: 'dashed', alignItems: 'center' },
  addAccountText: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1E293B', marginVertical: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  toggleInfo: { flex: 1, marginRight: 12 },
  toggleLabel: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  toggleSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  subscriptionCard: { backgroundColor: '#0F172A', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#38BDF830' },
  subscriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  subscriptionTier: { color: '#F1F5F9', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  subscriptionFeatures: { color: '#94A3B8', fontSize: 12, lineHeight: 18 },
  subscriptionPrice: { color: '#38BDF8', fontSize: 22, fontWeight: '900' },
  tierRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tierBadge: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center' },
  tierBadgeActive: { backgroundColor: '#38BDF8' },
  tierBadgeText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  tierBadgeTextActive: { color: '#fff' },
  upgradeButton: { backgroundColor: '#38BDF8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  upgradeButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  legalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  legalText: { color: '#F1F5F9', fontSize: 14 },
  legalArrow: { color: '#94A3B8', fontSize: 16 },
  legalVersion: { color: '#94A3B8', fontSize: 12 },
  signOutButton: { paddingVertical: 16, alignItems: 'center', marginBottom: 40 },
  signOutText: { color: '#94A3B8', fontSize: 15 },
});

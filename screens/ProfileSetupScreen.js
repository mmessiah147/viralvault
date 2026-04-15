import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';

const PILLARS = [
  'Extreme Sports & Adrenaline', 'Fitness & Training', 'Nutrition & Health',
  'Mindset & Philosophy', 'Travel & Adventure', 'Business & Entrepreneurship',
  'Finance & Investing', 'Fashion & Style', 'Beauty & Skincare', 'Food & Cooking',
  'Art & Creativity', 'Music & Performance', 'Comedy & Entertainment', 'Gaming & Tech',
  'Sports & Athletics', 'Relationships & Dating', 'Parenting & Family',
  'Spirituality & Wellness', 'Education & Productivity', 'Real Estate',
  'Cars & Automotive', 'Outdoors & Nature', 'Photography & Film', 'Dance & Movement',
  'Social Justice & Activism', 'DIY & Home', 'Pets & Animals', 'Science & Space',
  'Luxury & Lifestyle', 'Motorsports & Racing',
];

const PLATFORMS = ['Instagram', 'TikTok', 'Both'];
const PILLAR_COLORS = ['#38BDF8', '#34D399', '#FBBF24'];

export default function ProfileSetupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedPillars, setSelectedPillars] = useState([]);
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState('');

  const [fontsLoaded] = useFonts({ Cinzel_700Bold, Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold });

  const togglePillar = (pillar) => {
    if (selectedPillars.includes(pillar)) {
      setSelectedPillars(selectedPillars.filter(p => p !== pillar));
    } else if (selectedPillars.length < 3) {
      setSelectedPillars([...selectedPillars, pillar]);
    }
  };

  const pillarColor = (pillar) => {
    const i = selectedPillars.indexOf(pillar);
    return i >= 0 ? PILLAR_COLORS[i] : null;
  };

  const handleNext = async () => {
    setError('');
    if (step === 1) {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (!handle.trim()) { setError('Please enter your handle.'); return; }
      setStep(2);
    } else if (step === 2) {
      if (selectedPillars.length !== 3) { setError('Please select exactly 3 content pillars.'); return; }
      setStep(3);
    } else if (step === 3) {
      if (!platform) { setError('Please select a platform.'); return; }
      const profile = { name: name.trim(), handle: handle.trim().replace('@', ''), pillars: selectedPillars, platform };
      await AsyncStorage.setItem('viralvault_profile', JSON.stringify(profile));
      navigation.replace('Onboarding');
    }
  };

  const isDisabled = (pillar) => !selectedPillars.includes(pillar) && selectedPillars.length >= 3;

  return (
    <LinearGradient colors={['#0A0F1E', '#0F172A', '#0C1A2E']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>

          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <Text style={styles.logo}>Atlas</Text>
              <Text style={styles.logoAccent}>.ai</Text>
            </View>
            <Text style={styles.stepIndicator}>{step} of 3</Text>
          </View>

          <View style={styles.progressRow}>
            {[1,2,3].map(s => (
              <View key={s} style={[styles.progressStep, step >= s && styles.progressStepActive]} />
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {step === 1 && (
              <View style={styles.section}>
                <Text style={styles.title}>Tell us about yourself</Text>
                <Text style={styles.subtitle}>This helps us personalize your content strategy</Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>YOUR NAME</Text>
                  <TextInput style={styles.input} placeholder="e.g. Markus" placeholderTextColor="#334155" value={name} onChangeText={setName} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>YOUR HANDLE</Text>
                  <TextInput style={styles.input} placeholder="@yourhandle" placeholderTextColor="#334155" autoCapitalize="none" value={handle} onChangeText={setHandle} />
                </View>
              </View>
            )}
            {step === 2 && (
              <View style={styles.section}>
                <Text style={styles.title}>Pick your 3 pillars</Text>
                <Text style={styles.subtitle}>These define your content identity and everything Atlas.ai builds for you</Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                {selectedPillars.length > 0 && (
                  <View style={styles.selectedRow}>
                    {selectedPillars.map((p, i) => (
                      <View key={p} style={[styles.selectedTag, { backgroundColor: PILLAR_COLORS[i] + '20', borderColor: PILLAR_COLORS[i] }]}>
                        <Text style={[styles.selectedTagText, { color: PILLAR_COLORS[i] }]}>{p.split(' ')[0]}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.pillarsGrid}>
                  {PILLARS.map(pillar => {
                    const selected = selectedPillars.includes(pillar);
                    const disabled = isDisabled(pillar);
                    const color = pillarColor(pillar);
                    return (
                      <TouchableOpacity
                        key={pillar}
                        style={[
                          styles.pillarBtn,
                          selected && { backgroundColor: color + '20', borderColor: color },
                          disabled && styles.pillarBtnDisabled,
                        ]}
                        onPress={() => togglePillar(pillar)}
                        activeOpacity={disabled ? 1 : 0.7}
                      >
                        <Text style={[
                          styles.pillarText,
                          selected && { color: color, fontFamily: 'Raleway_700Bold' },
                          disabled && styles.pillarTextDisabled,
                        ]}>
                          {pillar}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.pillarCount}>{selectedPillars.length}/3 selected</Text>
              </View>
            )}
            {step === 3 && (
              <View style={styles.section}>
                <Text style={styles.title}>Where do you create?</Text>
                <Text style={styles.subtitle}>We will optimize your content strategy for your platform</Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <View style={styles.platformList}>
                  {PLATFORMS.map(p => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.platformBtn, platform === p && styles.platformBtnSelected]}
                      onPress={() => setPlatform(p)}
                    >
                      <Text style={[styles.platformText, platform === p && styles.platformTextSelected]}>{p}</Text>
                      {platform === p && <Text style={styles.platformCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => { setStep(step - 1); setError(''); }}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{step === 3 ? 'Finish Setup' : 'Continue'}</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboard: { flex: 1, paddingHorizontal: 24 },
  topBar: { flexDirection: 'row', jusfyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logo: { color: '#F1F5F9', fontSize: 20, fontFamily: 'Cinzel_700Bold', letterSpacing: 1 },
  logoAccent: { color: '#38BDF8', fontSize: 14, fontFamily: 'Raleway_300Light' },
  stepIndicator: { color: '#94A3B8', fontSize: 13, fontFamily: 'Raleway_500Medium' },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  progressStep: { flex: 1, height: 3, borderRadius: 2, backgroundColor: '#1E293B' },
  progressStepActive: { backgroundColor: '#38BDF8' },
  scroll: { paddingBottom: 20 },
  section: { gap: 16 },
  title: { color: '#F1F5F9', fontSize: 26, fontFamily: 'Raleway_700Bold', marginTop: 8 },
  subtitle: { color: '#94A3B8', fontSize: 14, fontFamily: 'Raleway_300Light', lineHeight: 22 },
  errorBox: { backgroundColor: '#ff000020', borderRadius: 10, padding: 12 },
  errorText: { color: '#ff6b6b', fontSize: 13, fontFamily: 'Raleway_500Medium' },
  inputGroup: { gap: 8 },
  inputLabel: { color: '#94A3B8', fontSize: 11, fontFamily: 'Raleway_600SemiBold', letterSpacing: 2 },
  input: { backgroundColor: '#111827', borderRadius: 12, padding: 16, color: '#F1F5F9', fontSize: 15, borderWidth: 1, borderColor: '#1E293B', fontFamily: 'Raleway_500Medium' },
  selectedRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  selectedTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  selectedTagText: { fontSize: 12, fontFamily: 'Raleway_700Bold' },
  pillarsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pillarBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', backgroundColor: '#111827' },
  pillarBtnDisabled: { opacity: 0.25 },
  pillarText: { color: '#94A3B8', fontSize: 13, fontFamily: 'Raleway_500Medium' },
  pillarTextDisabled: { color: '#1E293B' },
  pillarCount: { color: '#94A3B8', fontSize: 13, fontFamily: 'Raleway_500Medium', textAlign: 'center', marginTop: 8 },
  platformList: { gap: 12, marginTop: 8 },
  platformBtn: { backgroundColor: '#111827', borderRadius: 14, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  platformBtnSelected: { backgroundColor: '#38BDF820', borderColor: '#38BDF8' },
  platformText: { color: '#94A3B8', fontSize: 16, fontFamily: 'Raleway_600SemiBold' },
  platformTextSelected: { color: '#38BDF8', fontFamily: 'Raleway_700Bold' },
  platformCheck: { color: '#38BDF8', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', gap: 12, paddingVertical: 20 },
  backBtn: { flex: 1, backgroundColor: '#111827', paddingVertical: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  backBtnText: { color: '#F1F5F9', fontSize: 16, fontFamily: 'Raleway_600SemiBold' },
  nextBtn: { flex: 2, backgroundColor: '#38BDF8', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  nextBtnText: { color: '#0A0F1E', fontSize: 16, fontFamily: 'Raleway_700Bold' },
});

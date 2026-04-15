import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';

const BASE_URL = 'https://app--viracurate.base44.app/api/apps/69cef095cf537aae99ad1e98';

export default function AuthScreen({ navigation }) {
  const [step, setStep] = useState('login');
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const [fontsLoaded] = useFonts({ Cinzel_700Bold, Raleway_300Light, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold });

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleLoginCall = async () => {
    const res = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });
    const data = await res.json();
    if (data.access_token) {
      await AsyncStorage.setItem('atlas_token', data.access_token);
      navigation.replace('ProfileSetup');
    } else if (res.status === 200 || res.status === 202) {
      setStep('otp');
      setResendTimer(30);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    try { setLoading(true); setError(null); await handleLoginCall(); }
    catch (e) { setError('Could not sign in. Check your details and try again.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    try {
      setLoading(true); setError(null);
      const res = await fetch(BASE_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), turnstile_token: null, referral_code: null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || 'Could not create account.'); return; }
      await handleLoginCall();
    } catch (e) { setError('Could not create account. Try again.'); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true); setError(null);
      await fetch(BASE_URL + '/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setResendTimer(30);
    } catch (e) { setError('Could not resend code.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setError('Please enter the code from your email.'); return; }
    try {
      setLoading(true); setError(null);
      const res = await fetch(BASE_URL + '/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp_code: otp.trim() }),
      });
      const data = await res.json();
      const token = data.access_token || data.token;
      if (token) { await AsyncStorage.setItem('atlas_token', token); navigation.replace('ProfileSetup'); }
      else { setError('Invalid code. Please try again.'); }
    } catch (e) { setError('Invalid code. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#0F172A', '#0C1A2E']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>

          <View style={styles.top}>
            <View style={styles.logoRow}>
              <Text style={styles.logo}>Atlas</Text>
              <Text style={styles.logoAccent}>.ai</Text>
            </View>
            <Text style={styles.logoTagline}>by PV Labs</Text>
          </View>

          <View style={styles.form}>
            {step === 'otp' ? (
              <>
                <Text style={styles.formTitle}>Check your email</Text>
                <Text style={styles.formSub}>We sent a 6-digit code to {email}</Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CODE</Text>
                  <TextInput style={[styles.input, styles.otpInput]} placeholder="000000" placeholderTextColor="#334155" keyboardType="number-pad" value={otp} onChangeText={setOtp} maxLength={6} />
                </View>
                {loading ? <ActivityIndicator size="large" color="#38BDF8" /> : (
                  <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp}>
                    <Text style={styles.btnText}>Verify Code</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.resendBtn, resendTimer > 0 && styles.resendBtnDisabled]} onPress={handleResend} disabled={resendTimer > 0 || loading}>
                  <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchBtn} onPress={() => { setStep('login'); setOtp(''); setError(null); }}>
                  <Text style={styles.switchText}>Use a different email</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</Text>
                <Text style={styles.formSub}>{mode === 'login' ? 'Sign in to continue' : 'Start building your brand'}</Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#334155" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#334155" secureTextEntry value={password} onChangeText={setPassword} />
                </View>
                {loading ? <ActivityIndicator size="large" color="#38BDF8" /> : (
                  <TouchableOpacity style={styles.btn} onPress={mode === 'login' ? handleLogin : handleRegister}>
                    <Text style={styles.btnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.switchBtn} onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}>
                  <Text style={styles.switchText}>{mode === 'login' ? 'No account? Sign up' : 'Have an account? Sign in'}</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Main')}>
              <Text style={styles.skipText}>Skip for now</Text>
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
  keyboard: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 30, paddingVertical: 40 },
  top: { alignItems: 'center', paddingTop: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logo: { color: '#F1F5F9', fontSize: 52, fontFamily: 'Cinzel_700Bold', letterSpacing: 2 },
  logoAccent: { color: '#38BDF8', fontSize: 32, fontFamily: 'Raleway_300Light', letterSpacing: 1 },
  logoTagline: { color: '#94A3B8', fontSize: 12, fontFamily: 'Raleway_500Medium', letterSpacing: 3, marginTop: 4 },
  form: { gap: 16 },
  formTitle: { color: '#F1F5F9', fontSize: 26, fontFamily: 'Raleway_700Bold' },
  formSub: { color: '#94A3B8', fontSize: 15, fontFamily: 'Raleway_300Light' },
  errorBox: { backgroundColor: '#ff000020', borderRadius: 10, padding: 12 },
  errorText: { color: '#ff6b6b', fontSize: 13, fontFamily: 'Raleway_500Medium' },
  inputGroup: { gap: 8 },
  inputLabel: { color: '#94A3B8', fontSize: 11, fontFamily: 'Raleway_600SemiBold', letterSpacing: 2 },
  input: { backgroundColor: '#111827', borderRadius: 12, padding: 16, color: '#F1F5F9', fontSize: 15, borderWidth: 1, borderColor: '#1E293B', fontFamily: 'Raleway_500Medium' },
  otpInput: { fontSize: 28, fontWeight: '700', letterSpacing: 8, textAlign: 'center' },
  btn: { backgroundColor: '#38BDF8', paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#0A0F1E', fontSize: 16, fontFamily: 'Raleway_700Bold' },
  resendBtn: { alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#38BDF8' },
  resendBtnDisabled: { borderColor: '#1E293B' },
  resendText: { color: '#38BDF8', fontSize: 14, fontFamily: 'Raleway_600SemiBold' },
  resendTextDisabled: { color: '#334155' },
  switchBtn: { alignItems: 'center', paddingVertical: 8 },
  switchText: { color: '#94A3B8', fontSize: 14, fontFamily: 'Raleway_500Medium' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: '#334155', fontSize: 13, fontFamily: 'Raleway_500Medium' },
});

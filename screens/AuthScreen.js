import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { base44 } from '../api/base44Client';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      let result;
      if (mode === 'login') {
        result = await base44.auth.login(email, password);
      } else {
        result = await base44.auth.register(email, password);
      }
      if (result && result.token) {
        await base44.auth.setToken(result.token);
        navigation.replace('Main');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (e) {
      setError(mode === 'login' ? 'Invalid email or password.' : 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
          <View style={styles.top}>
            <Text style={styles.logo}>VIRAL</Text>
            <Text style={styles.logoAccent}>VAULT</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</Text>
            <Text style={styles.formSub}>{mode === 'login' ? 'Sign in to continue' : 'Start building your brand'}</Text>
            {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#444" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} placeholder="password" placeholderTextColor="#444" secureTextEntry value={password} onChangeText={setPassword} />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#ff6b35" />
            ) : (
              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.switchBtn} onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}>
              <Text style={styles.switchText}>{mode === 'login' ? 'No account? Sign up' : 'Have account? Sign in'}</Text>
            </TouchableOpacity>
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
  logo: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: 8 },
  logoAccent: { color: '#ff6b35', fontSize: 48, fontWeight: '900', letterSpacing: 8 },
  form: { gap: 16 },
  formTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  formSub: { color: '#666', fontSize: 15 },
  errorBox: { backgroundColor: '#ff000020', borderRadius: 10, padding: 12 },
  errorText: { color: '#ff6b6b', fontSize: 13 },
  inputGroup: { gap: 8 },
  inputLabel: { color: '#888', fontSize: 13, fontWeight: '600' },
  input: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a' },
  btn: { backgroundColor: '#ff6b35', paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchBtn: { alignItems: 'center', paddingVertical: 8 },
  switchText: { color: '#666', fontSize: 14 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: '#444', fontSize: 13 },
});

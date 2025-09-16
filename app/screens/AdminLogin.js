import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { loginAdmin } from '../../constants/api';

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert('Enter valid credentials');

    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      if (data?.admin) {
        navigation.replace('AdminDashboard', { admin: data.admin });
      } else {
        alert(data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err.response?.data || err.message);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        color={COLORS.primary}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});

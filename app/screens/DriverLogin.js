import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { loginDriver } from '../../constants/api'; // centralized API call

export default function DriverLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert('Enter valid credentials');

    setLoading(true);
    try {
      const data = await loginDriver(email, password);
      if (data?.driver) {
        navigation.replace('DriverDashboard', { driver: data.driver });
      } else {
        alert(data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Driver login error:', err.response?.data || err.message);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
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
        color={COLORS.driver}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.driver, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});

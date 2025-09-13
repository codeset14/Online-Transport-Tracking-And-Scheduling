import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import axios from 'axios';

const BASE_URL = 'http://YOUR_BACKEND_IP:PORT';

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) return alert('Enter valid credentials');

    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, { email, password });
      if (res.data.success) navigation.navigate('AdminDashboard', { admin: res.data.admin });
      else alert(res.data.message || 'Invalid credentials');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={login} color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});

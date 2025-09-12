import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function DriverLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (!email.includes('@') || !password) return alert('Enter valid credentials');
    navigation.navigate('DriverDashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={login} color={COLORS.driver} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor: COLORS.background, justifyContent:'center' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:16, color: COLORS.user },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12, marginBottom:12 }
});

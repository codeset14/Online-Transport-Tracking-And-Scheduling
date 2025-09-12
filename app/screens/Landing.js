import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function Landing() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BusTracker</Text>
      <Button title="User" onPress={() => navigation.navigate('UserLogin')} color={COLORS.user} />
      <Button title="Driver" onPress={() => navigation.navigate('DriverLogin')} color={COLORS.user} />
      <Button title="Admin" onPress={() => navigation.navigate('AdminLogin')} color={COLORS.user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.background },
  title: { fontSize:28, fontWeight:'bold', color: COLORS.primary, marginBottom:32 }
});

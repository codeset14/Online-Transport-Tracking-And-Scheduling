import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function DriverDashboard({ navigation }) {
  const [busNumber, setBusNumber] = useState('');

  const trackBus = () => {
    if (!busNumber) return alert('Enter Bus Number');
    navigation.navigate('MapScreen', { busNumber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      <TextInput
        placeholder="Enter Bus Number"
        style={styles.input}
        value={busNumber}
        onChangeText={setBusNumber}
      />
      <View style={styles.buttonContainer}>
        <Button title="Track Bus" onPress={trackBus} color={COLORS.driver} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor: COLORS.background },
  title: { fontSize:24, fontWeight:'bold', marginBottom:16, color: COLORS.driver },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12, marginBottom:12 },
  buttonContainer: { marginVertical:8 }
});

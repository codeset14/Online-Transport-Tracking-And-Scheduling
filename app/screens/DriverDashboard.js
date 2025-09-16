import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { COLORS } from '../../constants/colors';
import { getBusById } from '../../constants/api'; // centralized API

export default function DriverDashboard({ navigation }) {
  const [busNumber, setBusNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const trackBus = async () => {
    if (!busNumber) return alert('Enter Bus Number');
    setLoading(true);
    try {
      const bus = await getBusById(busNumber);
      if (bus) {
        navigation.navigate('MapScreen', { busNumber: bus.name, userType: 'driver' });
      } else {
        alert('Bus not found!');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching bus info');
    } finally {
      setLoading(false);
    }
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
        <Button
          title={loading ? 'Checking...' : 'Track Bus'}
          onPress={trackBus}
          color={COLORS.driver}
          disabled={loading}
        />
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

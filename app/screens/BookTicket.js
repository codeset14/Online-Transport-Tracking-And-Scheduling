import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function BookTicket({ route, navigation }) {
  const { bus } = route.params;
  const [name, setName] = useState('');
  const [seat, setSeat] = useState('');

  const confirmBooking = () => {
    if (!name || !seat) return alert('Please fill all details');
    alert(`Booking confirmed for ${name} on ${bus.name}, Seat: ${seat}`);
    navigation.navigate('UserDashboard', { bookedBus: bus });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Ticket</Text>
      <Text style={styles.busName}>{bus.name}</Text>
      <TextInput placeholder="Enter your name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Preferred seat number" style={styles.input} value={seat} onChangeText={setSeat} />
      <Button title="Confirm Booking" onPress={confirmBooking} color={COLORS.user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  busName: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: COLORS.text },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
});

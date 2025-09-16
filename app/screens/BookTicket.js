import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { bookBus } from '../../constants/api';

export default function BookTicket({ route, navigation }) {
  const { bus, user } = route.params;
  const [name, setName] = useState(user?.name || '');
  const [seat, setSeat] = useState('1');
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    if (!name || !seat) return alert('Please fill all details');

    setLoading(true);
    try {
      const booking = await bookBus(user?.id, bus.id, bus.routeId, seat, new Date().toISOString(), bus.fare);
      if (booking) {
        alert(`Booking confirmed for ${name} on ${bus.name}, Seat: ${seat}`);
        navigation.navigate('UserDashboard', { bookedBus: booking, user });
      } else {
        alert('Booking failed, try again!');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed, try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Ticket</Text>
      <Text style={styles.busName}>{bus.name}</Text>
      <TextInput placeholder="Enter your name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Preferred seat number" style={styles.input} value={seat} onChangeText={setSeat} keyboardType="numeric" />
      <Button title={loading ? 'Booking...' : 'Confirm Booking'} onPress={confirmBooking} color={COLORS.user} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  busName: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: COLORS.text },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
});

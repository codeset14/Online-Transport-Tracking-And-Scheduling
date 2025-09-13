import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import axios from 'axios';

// Backend base URL
const BASE_URL = 'http://YOUR_BACKEND_IP:PORT'; // replace with your friend's backend URL

export default function BookTicket({ route, navigation }) {
  const { bus, from, to, date, userId } = route.params; // get additional info from previous screen
  const [name, setName] = useState('');
  const [seat, setSeat] = useState('');
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    if (!name || !seat) return alert('Please fill all details');

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/tickets/book`, {
        busId: bus.id,
        userId: userId || 'USER_ID', // replace with real logged-in user ID
        passengerName: name,
        seatNumber: seat,
      });

      if (response.data?.success) {
        alert(`Booking confirmed for ${name} on ${bus.name}, Seat: ${seat}`);
        // Send booked bus info back to dashboard
        navigation.navigate('UserDashboard', { bookedBus: response.data.bookedBus });
      } else {
        alert('Booking failed, try again!');
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Booking failed, try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Ticket</Text>
      <Text style={styles.busName}>{bus.name}</Text>
      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Preferred seat number"
        style={styles.input}
        value={seat}
        onChangeText={setSeat}
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Booking...' : 'Confirm Booking'}
        onPress={confirmBooking}
        color={COLORS.user}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  busName: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: COLORS.text },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
});

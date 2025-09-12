import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function BookingCard({ booking }) {
  return (
    <View style={styles.card}>
      <Text style={styles.route}>{booking.routeName}</Text>
      <Text style={styles.text}>Seat: {booking.seat_no}</Text>
      <Text style={styles.text}>Fare: ₹{booking.fare}</Text>
      <Text style={styles.text}>Status: {booking.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{ width:'92%', backgroundColor:'#fff', padding:16, borderRadius:12, marginVertical:8, elevation:3 },
  route:{ fontSize:18, fontWeight:'bold', color: COLORS.primary },
  text:{ fontSize:16, marginTop:4 }
});

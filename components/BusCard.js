import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function BusCard({ bus, onSelect }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(bus)}>
      <Text style={styles.text}>Bus: {bus.name}</Text>
      <Text style={styles.text}>Seats: {bus.seats}</Text>
      <Text style={styles.text}>ETA: {bus.eta} min</Text>
      {bus.id && <Text style={styles.text}>ID: {bus.id}</Text>} {/* optional backend ID */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, padding:15, borderRadius:10, marginBottom:10, elevation:3 },
  text: { fontSize:16 }
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../../constants/colors';
import BusCard from '../../components/BusCard';

export default function UserDashboard({ navigation, route }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [busList, setBusList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    if (route.params?.bookedBus) setSelectedBus(route.params.bookedBus);
  }, [route.params?.bookedBus]);

  const searchBus = () => {
    if (!from || !to || !date) {
      alert('Please fill all fields');
      return;
    }
    setBusList([
      { id: '1', name: `${from} → ${to} Express`, seats: 40, eta: 120 },
      { id: '2', name: `${from} → ${to} SuperFast`, seats: 30, eta: 100 },
    ]);
  };

  const bookTicket = (bus) => navigation.navigate('BookTicket', { bus });

  const showMap = () => {
    if (!selectedBus) return alert('Please book a bus first!');
    navigation.navigate('MapScreen', { busNumber: selectedBus.name });
  };

  return (
    <View style={styles.container}>
      {!selectedBus && (
        <>
          <Text style={styles.title}>Book Your Bus</Text>
          <TextInput placeholder="Starting city" style={styles.input} value={from} onChangeText={setFrom} />
          <TextInput placeholder="Destination city" style={styles.input} value={to} onChangeText={setTo} />
          <TextInput placeholder="Journey date" style={styles.input} value={date} onChangeText={setDate} />
          <View style={styles.buttonContainer}>
            <Button title="SEARCH BUS" onPress={searchBus} color={COLORS.user} />
          </View>
        </>
      )}

      {busList.length > 0 && !selectedBus && (
        <>
          <Text style={styles.subtitle}>Available Buses</Text>
          <FlatList
            data={busList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BusCard bus={item} onSelect={bookTicket} />}
            style={{ marginTop: 16 }}
          />
        </>
      )}

      {selectedBus && (
        <View style={styles.buttonContainer}>
          <Text style={styles.subtitle}>Booked: {selectedBus.name}</Text>
          <Button title="View Live Map" onPress={showMap} color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 6, color: COLORS.text },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
  buttonContainer: { marginVertical: 8 },
});

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { COLORS } from '../../constants/colors';
import BusCard from '../../components/BusCard';
import BookBusForm from '../../components/BookBusForm';
import axios from 'axios';

// Backend base URL
const BASE_URL = 'http://YOUR_BACKEND_IP:PORT'; // replace with your backend URL

export default function UserDashboard({ navigation, route }) {
  const [busList, setBusList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    if (route.params?.bookedBus) setSelectedBus(route.params.bookedBus);
  }, [route.params?.bookedBus]);

  const handleSearchResults = (buses) => {
    setBusList(buses);
  };

  const bookTicket = async (bus) => {
    try {
      // Replace with actual user ID from login
      const userId = 'USER_ID';

      const response = await axios.post(`${BASE_URL}/api/tickets/book`, {
        busId: bus.id,
        userId,
      });

      if (response.data?.success) {
        setSelectedBus(response.data.bookedBus);
        // Navigate to MapScreen in app/screens/
        navigation.navigate('MapScreen', { busNumber: response.data.bookedBus.name });
      } else {
        alert('Booking failed, try again!');
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Booking failed, try again!');
    }
  };

  const showMap = () => {
    if (!selectedBus) return alert('Please book a bus first!');
    // Navigate to MapScreen in app/screens/
    navigation.navigate('MapScreen', { busNumber: selectedBus.name });
  };

  return (
    <View style={styles.container}>
      {!selectedBus && (
        <>
          <Text style={styles.title}>Book Your Bus</Text>
          <BookBusForm onSearchResults={handleSearchResults} />

          {busList.length > 0 && (
            <>
              <Text style={styles.subtitle}>Available Buses</Text>
              <FlatList
                data={busList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BusCard bus={item} onSelect={bookTicket} />}
                style={{ marginTop: 16 }}
              />
            </>
          )}
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
  buttonContainer: { marginVertical: 8 },
});

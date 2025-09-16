import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { COLORS } from '../../constants/colors';
import BusCard from '../../components/BusCard';
import BookBusForm from '../../components/BookBusForm';
import { bookBus } from '../../constants/api'; // centralized API

export default function UserDashboard({ navigation, route }) {
  const [busList, setBusList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.bookedBus) setSelectedBus(route.params.bookedBus);
  }, [route.params?.bookedBus]);

  const handleSearchResults = (buses) => setBusList(buses);

  const handleBookTicket = async (bus) => {
    setLoading(true);
    try {
      const userId = route.params?.user?.id || 'USER_ID';
      const booking = await bookBus(
        userId,
        bus.id,
        bus.route_id,
        '1',
        new Date().toISOString(),
        bus.fare
      );

      if (booking) {
        setSelectedBus(booking);
        navigation.navigate('MapScreen', { busNumber: booking.name, userType: 'user' });
      } else {
        alert('Booking failed. Please try again!');
      }
    } catch (err) {
      console.error('Error booking ticket:', err);
      alert('Booking failed. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const showMap = () => {
    if (!selectedBus) return alert('Please book a bus first!');
    navigation.navigate('MapScreen', { busNumber: selectedBus.name, userType: 'user' });
  };

  return (
    <View style={styles.container}>
      {!selectedBus ? (
        <>
          <Text style={styles.title}>Book Your Bus</Text>
          <BookBusForm onSearchResults={handleSearchResults} />

          {busList.length > 0 && (
            <>
              <Text style={styles.subtitle}>Available Buses</Text>
              <FlatList
                data={busList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <BusCard
                    bus={item}
                    onSelect={handleBookTicket}
                    loading={loading}
                    showRoute
                  />
                )}
                style={{ marginTop: 16 }}
              />
            </>
          )}
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.subtitle}>Booked: {selectedBus.name}</Text>
          <Button title="View Live Map" onPress={showMap} color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: COLORS.text,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { getBuses, cancelBooking } from '../../constants/api'; // centralized API

export default function AdminDashboard({ navigation }) {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await getBuses();
        setBuses(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching buses');
      }
    };
    fetchBuses();
  }, []);

  const deleteBus = async (busId) => {
    try {
      await cancelBooking(busId); // or use proper deleteBus API if exists
      setBuses(prev => prev.filter(b => b.id !== busId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete bus');
    }
  };

  const viewBusOnMap = (busNumber) => {
    navigation.navigate('MapScreen', { busNumber, userType: 'admin' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.busItem}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection:'row', gap: 8 }}>
              <Button title="Delete" color="red" onPress={() => deleteBus(item.id)} />
              <Button title="View Map" color={COLORS.primary} onPress={() => viewBusOnMap(item.name)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  busItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
});

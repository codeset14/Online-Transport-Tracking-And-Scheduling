import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import axios from 'axios';

const BASE_URL = 'http://YOUR_BACKEND_IP:PORT';

export default function AdminDashboard() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // fetch all buses from backend
    const fetchBuses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/buses`);
        setBuses(res.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching buses');
      }
    };
    fetchBuses();
  }, []);

  const deleteBus = async (busId) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/bus/${busId}`);
      setBuses((prev) => prev.filter((b) => b.id !== busId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete bus');
    }
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
            <Button title="Delete" color="red" onPress={() => deleteBus(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: COLORS.primary },
  busItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
});

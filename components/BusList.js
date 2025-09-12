import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BusCard from './BusCard';

export default function BusList({ route, navigation }) {
  const { from, to, date } = route.params;

  // Dummy buses for demonstration
  const buses = [
    { id: '1', name: 'Express 101', seats: 30, eta: 45 },
    { id: '2', name: 'SuperFast 202', seats: 20, eta: 60 },
    { id: '3', name: 'CityLink 303', seats: 25, eta: 50 },
  ];

  const handleSelectBus = (bus) => {
    navigation.navigate('BookTicket', { bus, from, to, date });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BusCard bus={item} onSelect={handleSelectBus} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor: '#F5F5F5' }
});

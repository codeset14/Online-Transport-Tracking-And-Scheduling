import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BusCard from './BusCard';
import { buses } from '../data/dummyBuses';

export default function BusList({ navigation }) {
  const handleSelectBus = (bus) => {
    navigation.navigate('MapScreen', {
      busNumber: bus.id, // MUST use real ID for backend tracking
      userType: 'user',
    });
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
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
});

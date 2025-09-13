import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BusCard from './BusCard';

export default function BusList({ buses, from, to, date, navigation }) {

  const handleSelectBus = (bus) => {
    // Navigate to BookTicket screen with selected bus info
    navigation.navigate('BookTicket', { bus, from, to, date });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={buses} // now coming from backend
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => <BusCard bus={item} onSelect={handleSelectBus} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
});

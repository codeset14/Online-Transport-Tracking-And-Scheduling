import React, { useState } from 'react';
import { searchBuses } from '../constants/api';
import { View, TextInput, Button, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookBusForm({ onSearchResults }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim() || !date) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const results = await searchBuses(source.trim(), destination.trim(), date.toISOString());

      // Enrich each bus with route info for display
      const enrichedResults = results.map(bus => ({
        ...bus,
        routeName: bus.route_name || `${bus.source} → ${bus.destination}`,
        fare: bus.fare || 'N/A'
      }));

      if (onSearchResults) onSearchResults(enrichedResults);
    } catch (err) {
      console.error('Error fetching buses:', err);
      alert('Failed to fetch buses. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter source"
        style={styles.input}
        value={source}
        onChangeText={setSource}
      />
      <TextInput
        placeholder="Enter destination"
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: '#333' }}>{`Select Date: ${date.toDateString()}`}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <View style={{ marginTop: 12 }}>
        <Button
          title={loading ? "Searching..." : "Search Bus"}
          onPress={handleSearch}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '92%', marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

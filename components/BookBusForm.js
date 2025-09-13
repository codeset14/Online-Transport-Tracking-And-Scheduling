import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const BASE_URL = 'http://YOUR_BACKEND_IP:PORT';

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
    if (!source || !destination || !date) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/buses/search`, {
        from: source,
        to: destination,
        date: date.toISOString(),
      });

      if (onSearchResults) onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching buses:', error);
      alert('Failed to fetch buses. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Enter source'
        style={styles.input}
        value={source}
        onChangeText={setSource}
      />
      <TextInput
        placeholder='Enter destination'
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
          mode='date'
          display='default'
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
      <View style={{ marginTop: 12 }}>
        <Button title={loading ? 'Searching...' : 'Search Bus'} onPress={handleSearch} disabled={loading} />
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

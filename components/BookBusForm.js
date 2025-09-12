import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function BookBusForm({ onSearch }) {
  return (
    <View style={styles.container}>
      <TextInput placeholder='Enter source' style={styles.input}/>
      <TextInput placeholder='Enter destination' style={styles.input}/>
      <Button title='Search Bus' onPress={onSearch}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ width:'92%', marginVertical:12 },
  input:{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12, marginBottom:8 }
});

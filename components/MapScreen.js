import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { COLORS } from '../constants/colors';

export default function MapScreen({ route }) {
  const { busNumber } = route.params || {};
  const [eta, setEta] = useState(null);

  // Default region (Punjab demo route: Amritsar → Chandigarh)
  const defaultRegion = {
    latitude: 31.6340, // Amritsar
    longitude: 74.8723,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  // Demo bus route coordinates
  const busRoute = [
    { latitude: 31.6340, longitude: 74.8723 }, // Amritsar
    { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  ];

  // If a bus is booked → set ETA (minutes)
  useEffect(() => {
    if (busNumber) {
      // For demo, just set ETA from bus name (mock logic)
      if (busNumber.includes("Express")) setEta(120);
      else if (busNumber.includes("SuperFast")) setEta(100);
      else setEta(90);
    }
  }, [busNumber]);

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView style={styles.map} initialRegion={defaultRegion}>
        {busNumber ? (
          <>
            {/* Polyline showing bus route */}
            <Polyline
              coordinates={busRoute}
              strokeColor={COLORS.primary}
              strokeWidth={4}
            />

            {/* Start Marker */}
            <Marker coordinate={busRoute[0]} title="Start" description="Amritsar" />
            {/* End Marker */}
            <Marker coordinate={busRoute[1]} title="Destination" description="Chandigarh" />
            {/* Bus Marker */}
            <Marker
              coordinate={busRoute[0]}
              title={busNumber}
              description="Your booked bus"
              pinColor={COLORS.user}
            />
          </>
        ) : (
          <Marker
            coordinate={defaultRegion}
            title="Map Center"
            description="No bus selected"
          />
        )}
      </MapView>

      {/* ETA Bottom Card */}
      {busNumber && (
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>
            🚌 {busNumber} — ETA: {eta} minutes
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  etaContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  etaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
});

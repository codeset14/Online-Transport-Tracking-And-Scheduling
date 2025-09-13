import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { COLORS } from '../../constants/colors';
import axios from 'axios';

const BASE_URL = 'http://YOUR_BACKEND_IP:PORT'; // replace with actual backend

export default function MapScreen({ route }) {
  const { busNumber } = route.params || {};
  const [busRoute, setBusRoute] = useState([]);
  const [eta, setEta] = useState(null);

  const defaultRegion = {
    latitude: 31.6340,
    longitude: 74.8723,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  useEffect(() => {
    if (!busNumber) return;

    // Fetch live route from backend
    const fetchBusRoute = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/bus/${busNumber}/route`);
        setBusRoute(res.data.route); // should be array of {latitude, longitude}
        setEta(res.data.eta); // backend provides ETA in minutes
      } catch (err) {
        console.error(err);
        alert('Error fetching bus route');
        setBusRoute([defaultRegion]);
        setEta(null);
      }
    };

    fetchBusRoute();
  }, [busNumber]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={defaultRegion}>
        {busRoute.length > 0 && (
          <>
            <Polyline coordinates={busRoute} strokeColor={COLORS.primary} strokeWidth={4} />
            <Marker coordinate={busRoute[0]} title="Start" />
            <Marker coordinate={busRoute[busRoute.length - 1]} title="Destination" />
            <Marker coordinate={busRoute[0]} title={busNumber} pinColor={COLORS.user} />
          </>
        )}
      </MapView>

      {busNumber && eta && (
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>🚌 {busNumber} — ETA: {eta} minutes</Text>
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
  etaText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },
});

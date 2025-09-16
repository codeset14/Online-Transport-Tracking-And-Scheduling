import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import { COLORS } from '../../constants/colors';

export default function MapScreen({ route }) {
  const { busNumber, userType } = route.params || {};
  const [eta, setEta] = useState(30); // dummy ETA
  const markerRef = useRef(null);

  // Predefined dummy route (Amritsar → Chandigarh)
  const dummyRoute = [
    { latitude: 31.6340, longitude: 74.8723 },
    { latitude: 31.4000, longitude: 75.0000 },
    { latitude: 31.2000, longitude: 75.2000 },
    { latitude: 31.0000, longitude: 75.4000 },
    { latitude: 30.8000, longitude: 75.6000 },
    { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
  ];

  // Animated region for marker movement
  const [markerRegion] = useState(
    new AnimatedRegion({
      latitude: dummyRoute[0].latitude,
      longitude: dummyRoute[0].longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  );

  useEffect(() => {
    let index = 0;

    const moveMarker = () => {
      index = (index + 1) % dummyRoute.length;
      const nextCoord = dummyRoute[index];

      if (Platform.OS === 'android') {
        markerRegion.timing(nextCoord).start();
      } else {
        markerRegion.timing({
          latitude: nextCoord.latitude,
          longitude: nextCoord.longitude,
          duration: 2000,
        }).start();
      }
    };

    const interval = setInterval(moveMarker, 2000); // move every 2s
    return () => clearInterval(interval);
  }, []);

  const getMarkerColor = () => {
    switch (userType) {
      case 'driver': return COLORS.driver;
      case 'admin': return COLORS.primary;
      default: return COLORS.user;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: dummyRoute[0].latitude,
          longitude: dummyRoute[0].longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        <Polyline coordinates={dummyRoute} strokeColor={COLORS.primary} strokeWidth={4} />

        <Marker.Animated
          ref={markerRef}
          coordinate={markerRegion}
          title={busNumber || 'Dummy Bus'}
          pinColor={getMarkerColor()}
        />

        <Marker coordinate={dummyRoute[0]} title="Start" />
        <Marker coordinate={dummyRoute[dummyRoute.length - 1]} title="Destination" />
      </MapView>

      {busNumber && eta !== null && (
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>🚌 {busNumber || 'Dummy Bus'} — ETA: {eta} min</Text>
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

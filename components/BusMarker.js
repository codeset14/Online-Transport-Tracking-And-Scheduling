import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import { COLORS } from '../../constants/colors';
import { getBusTracking } from '../../constants/api';
import BusMarker from '../../components/BusMarker';

export default function MapScreen({ route }) {
  const { busNumber, userType } = route.params || {};
  const [busRoute, setBusRoute] = useState([]);
  const [eta, setEta] = useState(null);

  const markerRef = useRef(null);
  const mapRef = useRef(null);

  // Animated region for smooth marker movement
  const [markerRegion] = useState(
    new AnimatedRegion({
      latitude: 31.6340,
      longitude: 74.8723,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  );

  const fetchTracking = async () => {
    if (!busNumber) return;
    try {
      const tracking = await getBusTracking(busNumber);
      const route = tracking?.route || [{ latitude: 31.6340, longitude: 74.8723 }];
      setBusRoute(route);
      setEta(tracking?.eta || null);

      // Update marker smoothly to latest location
      if (route.length > 0) {
        const latest = route[0];
        if (Platform.OS === 'android') {
          markerRegion.timing(latest).start();
        } else {
          markerRegion.timing({
            latitude: latest.latitude,
            longitude: latest.longitude,
            duration: 4000,
          }).start();
        }
      }

    } catch (err) {
      console.error('Bus tracking error:', err);
    }
  };

  useEffect(() => {
    fetchTracking(); // initial fetch
    const interval = setInterval(fetchTracking, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [busNumber]);

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
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 31.6340,
          longitude: 74.8723,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {busRoute.length > 1 && (
          <Polyline coordinates={busRoute} strokeColor={COLORS.primary} strokeWidth={4} />
        )}

        {/* Animated Bus Marker */}
        <Marker.Animated
          ref={markerRef}
          coordinate={markerRegion}
          title={busNumber}
          pinColor={getMarkerColor()}
        />

        {/* Optional start/destination markers */}
        {busRoute.length > 1 && (
          <>
            <Marker coordinate={busRoute[0]} title="Start" />
            <Marker coordinate={busRoute[busRoute.length - 1]} title="Destination" />
          </>
        )}
      </MapView>

      {busNumber && eta !== null && (
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

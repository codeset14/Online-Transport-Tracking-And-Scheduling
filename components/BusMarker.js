import React from 'react';
import { Marker } from 'react-native-maps';
import busIcon from '../assets/bus-blue.png'; // keep your bus icon

export default function BusMarker({ bus }) {
  return (
    <Marker
      coordinate={bus.coordinate}       // backend provides {latitude, longitude}
      title={bus.name}                   // bus name from backend
      description={bus.status || ''}     // optional status from backend
      image={busIcon}
    />
  );
}

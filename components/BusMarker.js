import React from 'react';
import { Marker } from 'react-native-maps';
import busIcon from '../assets/bus-blue.png'; // add bus icon

export default function BusMarker({ coordinate }) {
  return <Marker coordinate={coordinate} image={busIcon} />;
}

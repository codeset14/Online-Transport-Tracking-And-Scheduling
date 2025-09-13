import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Landing from './app/screens/Landing';
import UserLogin from './app/screens/UserLogin';
import DriverLogin from './app/screens/DriverLogin';
import AdminLogin from './app/screens/AdminLogin';
import UserDashboard from './app/screens/UserDashboard';
import DriverDashboard from './app/screens/DriverDashboard';
import AdminDashboard from './app/screens/AdminDashboard';
import BookTicket from './app/screens/BookTicket';

// Updated MapScreen import (backend-ready)
import MapScreen from './app/screens/MapScreen'; // <-- make sure path points here

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        {/* Landing Page */}
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />

        {/* Logins */}
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="DriverLogin" component={DriverLogin} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />

        {/* Dashboards */}
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: "User Dashboard" }} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} options={{ title: "Driver Dashboard" }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Admin Dashboard" }} />

        {/* Booking & Map */}
        <Stack.Screen name="BookTicket" component={BookTicket} options={{ title: "Book Ticket" }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: "Live Bus Tracking" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Landing from "./app/screens/Landing";
import UserLogin from "./app/screens/UserLogin";
import DriverLogin from "./app/screens/DriverLogin";
import AdminLogin from "./app/screens/AdminLogin";
import UserDashboard from "./app/screens/UserDashboard";
import DriverDashboard from "./app/screens/DriverDashboard";
import AdminDashboard from "./app/screens/AdminDashboard";
import BookTicket from "./app/screens/BookTicket";
import MapScreen from "./app/screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerTitleAlign: "center",
          animation: "slide_from_right",
        }}
      >
        {/* Landing Page */}
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }}
        />

        {/* Login Screens */}
        <Stack.Screen
          name="UserLogin"
          component={UserLogin}
          options={{ title: "User Login" }}
        />
        <Stack.Screen
          name="DriverLogin"
          component={DriverLogin}
          options={{ title: "Driver Login" }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{ title: "Admin Login" }}
        />

        {/* Dashboard Screens */}
        <Stack.Screen
          name="UserDashboard"
          component={UserDashboard}
          options={{ title: "User Dashboard", headerBackVisible: false }}
        />
        <Stack.Screen
          name="DriverDashboard"
          component={DriverDashboard}
          options={{ title: "Driver Dashboard", headerBackVisible: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Admin Dashboard", headerBackVisible: false }}
        />

        {/* Booking & Map */}
        <Stack.Screen
          name="BookTicket"
          component={BookTicket}
          options={{ title: "Book Ticket" }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Live Bus Tracking" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

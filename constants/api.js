import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:5000'; // ⚡ must match the variable used below

// User APIs
export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/user/login`, { email, password });
  return res.data;
};

// Driver APIs
export const loginDriver = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/driver/login`, { email, password });
  return res.data;
};

// Admin APIs
export const loginAdmin = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/admin/login`, { email, password });
  return res.data;
};

// Buses APIs
export const getBuses = async () => {
  const res = await axios.get(`${BASE_URL}/buses`);
  return res.data;
};

export const getBusById = async (busNumber) => {
  const res = await axios.get(`${BASE_URL}/buses/${busNumber}`);
  return res.data;
};

// ✅ Fixed parameter names
export const searchBuses = async (source, destination, date) => {
  const res = await axios.get(`${BASE_URL}/buses/search`, {
    params: { source, destination, date },
  });
  return res.data;
};

export const bookBus = async (userId, busId, routeId, seat, date, fare) => {
  const res = await axios.post(`${BASE_URL}/bookings`, { userId, busId, routeId, seat, date, fare });
  return res.data;
};

export const cancelBooking = async (busId) => {
  const res = await axios.delete(`${BASE_URL}/bookings/${busId}`);
  return res.data;
};

export const getBusTracking = async (busNumber) => {
  const res = await axios.get(`${BASE_URL}/tracking/${busNumber}`);
  return res.data;
};

export const updateBusLocation = async (busNumber, latitude, longitude) => {
  const res = await axios.post(`${BASE_URL}/tracking/${busNumber}`, { latitude, longitude });
  return res.data;
};

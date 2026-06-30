import axios from 'axios';

// In a real app, these would come from import.meta.env
const AUTH_URL = 'http://localhost:3000/auth';
const RIDE_URL = 'http://localhost:3000/api/rides';
const BOOKING_URL = 'http://localhost:3000/api/v1/bookings';
const VEHICLE_URL = 'http://localhost:3000/api/vehicles';
const USER_URL = 'http://localhost:3000/api/users';
const MATCHING_URL = 'http://localhost:3000/api/v1/matchings';

export const authApi = axios.create({ baseURL: AUTH_URL });
export const userApi = axios.create({ baseURL: USER_URL });
export const rideApi = axios.create({ baseURL: RIDE_URL });
export const bookingApi = axios.create({ baseURL: BOOKING_URL });
export const vehicleApi = axios.create({ baseURL: VEHICLE_URL });
export const matchingApi = axios.create({ baseURL: MATCHING_URL });

// Interceptor to add token to requests
const setupInterceptors = (client: any, clientType?: string) => {
  client.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (clientType) {
      config.headers['x-client-type'] = clientType;
    }
    return config;
  });
};

setupInterceptors(authApi, 'user');
setupInterceptors(userApi, 'user');
setupInterceptors(rideApi);
setupInterceptors(bookingApi);
setupInterceptors(vehicleApi);

import axios from 'axios';

// The API client connects to the relative /api in current host,
// which works seamlessly both in the AI Studio live preview container
// and with proxy or when configured against http://localhost:8080.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT/session token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusbite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please check network connection.';
    return Promise.reject(new Error(message));
  }
);

export default api;

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          // Optionally redirect to login
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 417:
          // Token expired (custom status from backend)
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          break;

        case 500:
          // Server error
          console.error('Server error');
          break;

        default:
          console.error('API Error:', data?.error || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper for making GET requests with caching
export const cachedGet = async (url, cacheKey, cacheDuration = 5 * 60 * 1000) => {
  const cacheData = sessionStorage.getItem(cacheKey);

  if (cacheData) {
    const { data, timestamp } = JSON.parse(cacheData);
    if (Date.now() - timestamp < cacheDuration) {
      return { data, fromCache: true };
    }
  }

  const response = await api.get(url);

  sessionStorage.setItem(
    cacheKey,
    JSON.stringify({
      data: response.data,
      timestamp: Date.now(),
    })
  );

  return { data: response.data, fromCache: false };
};

// Clear specific cache
export const clearCache = (cacheKey) => {
  sessionStorage.removeItem(cacheKey);
};

// Clear all API caches
export const clearAllCaches = () => {
  const keys = Object.keys(sessionStorage);
  keys.forEach((key) => {
    if (key.startsWith('gods_garden_cache_')) {
      sessionStorage.removeItem(key);
    }
  });
};

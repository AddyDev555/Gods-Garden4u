import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/gods-garden/axiosConfig';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/helpers';

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      const savedToken = storage.get(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = storage.get(STORAGE_KEYS.USER);

      if (savedToken) {
        setToken(savedToken);
        setUser(savedUser);
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen for storage events (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.AUTH_TOKEN) {
        if (e.newValue) {
          setToken(JSON.parse(e.newValue));
          setUser(storage.get(STORAGE_KEYS.USER));
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login with mobile number
  const login = useCallback(async (mobileNumber, countryCode = '91') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/login/', {
        mobile_number: mobileNumber,
        country_code: countryCode,
      });

      const { token: authToken, ...userData } = response.data;

      // Store auth data
      setToken(authToken);
      setUser(userData);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
      storage.set(STORAGE_KEYS.USER, userData);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/signup/', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        mobile_number: userData.mobileNumber,
        country_code: userData.countryCode || '91',
      });

      const { token: authToken, ...user } = response.data;

      // Auto-login after registration
      if (authToken) {
        setToken(authToken);
        setUser(user);
        storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
        storage.set(STORAGE_KEYS.USER, user);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);

    // Clear cart association if needed
    // Note: Cart is session-based, so we may want to keep it
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put('/profile/', profileData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER, updatedUser);

      return { success: true, data: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Update failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if authenticated
  const isAuthenticated = useMemo(() => !!token, [token]);

  // Context value
  const value = useMemo(
    () => ({
      // State
      user,
      token,
      isLoading,
      error,
      isAuthenticated,

      // Methods
      login,
      register,
      logout,
      updateProfile,
      clearError,
    }),
    [user, token, isLoading, error, isAuthenticated, login, register, logout, updateProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

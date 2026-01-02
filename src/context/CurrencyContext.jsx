import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, EXCHANGE_RATE, STORAGE_KEYS } from '../utils/constants';
import { formatPrice, convertPrice, getCurrencySymbol, getShippingInfo } from '../utils/currency';
import { storage } from '../utils/helpers';

// Create context
const CurrencyContext = createContext(null);

// IP Geolocation API endpoint (free tier)
const GEO_API_URL = 'https://ipapi.co/json/';

/**
 * CurrencyProvider - Manages currency state and geo detection
 */
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Detect user location on mount
  useEffect(() => {
    const detectCurrency = async () => {
      setIsLoading(true);

      try {
        // First check if user has a saved preference
        const savedCurrency = storage.get(STORAGE_KEYS.CURRENCY);
        if (savedCurrency && CURRENCIES[savedCurrency]) {
          setCurrencyState(savedCurrency);
          setIsManualSelection(true);
          setIsLoading(false);
          return;
        }

        // Try to detect location via IP
        const response = await fetch(GEO_API_URL);
        if (!response.ok) throw new Error('Geo API failed');

        const data = await response.json();
        setUserLocation({
          country: data.country_name,
          countryCode: data.country_code,
          city: data.city,
          region: data.region,
        });

        // Set currency based on location
        const detectedCurrency = data.country_code === 'IN' ? 'INR' : 'USD';
        setCurrencyState(detectedCurrency);
        storage.set(STORAGE_KEYS.CURRENCY, detectedCurrency);
      } catch (error) {
        console.warn('Currency detection failed, using default:', error.message);
        // Default to INR
        setCurrencyState('INR');
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  // Set currency manually
  const setCurrency = useCallback((newCurrency) => {
    if (!CURRENCIES[newCurrency]) {
      console.warn('Invalid currency:', newCurrency);
      return;
    }

    setCurrencyState(newCurrency);
    setIsManualSelection(true);
    storage.set(STORAGE_KEYS.CURRENCY, newCurrency);
  }, []);

  // Format price helper
  const format = useCallback(
    (priceInINR, options = {}) => {
      return formatPrice(priceInINR, currency, { exchangeRate: EXCHANGE_RATE, ...options });
    },
    [currency]
  );

  // Convert price helper
  const convert = useCallback(
    (price, fromCurrency = 'INR') => {
      return convertPrice(price, fromCurrency, currency, EXCHANGE_RATE);
    },
    [currency]
  );

  // Get current symbol
  const symbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  // Get current config
  const config = useMemo(() => CURRENCIES[currency] || CURRENCIES.INR, [currency]);

  // Get shipping info helper
  const getShipping = useCallback(
    (cartTotal) => {
      return getShippingInfo(cartTotal, currency, EXCHANGE_RATE);
    },
    [currency]
  );

  // Check if India
  const isIndia = useMemo(() => currency === 'INR', [currency]);

  // Context value
  const value = useMemo(
    () => ({
      // State
      currency,
      isLoading,
      userLocation,
      isManualSelection,
      exchangeRate: EXCHANGE_RATE,

      // Currency info
      symbol,
      config,
      currencies: CURRENCIES,
      isIndia,

      // Methods
      setCurrency,
      formatPrice: format,
      convertPrice: convert,
      getShippingInfo: getShipping,

      // Raw utilities
      format,
      convert,
    }),
    [
      currency,
      isLoading,
      userLocation,
      isManualSelection,
      symbol,
      config,
      isIndia,
      setCurrency,
      format,
      convert,
      getShipping,
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

/**
 * useCurrency hook
 * @returns {object} Currency context value
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;

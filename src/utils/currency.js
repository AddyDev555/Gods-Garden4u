import { CURRENCIES, EXCHANGE_RATE } from './constants';

/**
 * Format price based on currency
 * @param {number} priceInINR - Price in Indian Rupees
 * @param {string} currency - Currency code (INR or USD)
 * @param {object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (priceInINR, currency = 'INR', options = {}) => {
  const {
    showSymbol = true,
    showCode = false,
    exchangeRate = EXCHANGE_RATE,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  if (priceInINR === null || priceInINR === undefined || isNaN(priceInINR)) {
    return currency === 'USD' ? '$0.00' : '₹0';
  }

  const currencyConfig = CURRENCIES[currency] || CURRENCIES.INR;
  let price = parseFloat(priceInINR);

  // Convert to USD if needed
  if (currency === 'USD') {
    price = price / exchangeRate;
  }

  // Format options
  const formatOptions = {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: minimumFractionDigits ?? (currency === 'USD' ? 2 : 0),
    maximumFractionDigits: maximumFractionDigits ?? (currency === 'USD' ? 2 : 0),
  };

  try {
    let formatted = new Intl.NumberFormat(currencyConfig.locale, formatOptions).format(price);

    // Remove symbol if not needed
    if (!showSymbol) {
      formatted = formatted.replace(/[₹$]/g, '').trim();
    }

    // Add currency code if needed
    if (showCode) {
      formatted = `${formatted} ${currencyConfig.code}`;
    }

    return formatted;
  } catch (error) {
    // Fallback formatting
    const symbol = showSymbol ? currencyConfig.symbol : '';
    const formattedNumber = price.toFixed(currency === 'USD' ? 2 : 0);
    return `${symbol}${formattedNumber}`;
  }
};

/**
 * Convert price between currencies
 * @param {number} price - Price to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} exchangeRate - Exchange rate (INR to USD)
 * @returns {number} Converted price
 */
export const convertPrice = (price, fromCurrency, toCurrency, exchangeRate = EXCHANGE_RATE) => {
  if (fromCurrency === toCurrency) {
    return price;
  }

  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return price / exchangeRate;
  }

  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return price * exchangeRate;
  }

  return price;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'INR') => {
  return CURRENCIES[currency]?.symbol || '₹';
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Format price range
 * @param {number} minPrice - Minimum price in INR
 * @param {number} maxPrice - Maximum price in INR
 * @param {string} currency - Currency code
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, currency = 'INR') => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};

/**
 * Round price to nearest friendly number
 * For USD: round to .99 format
 * For INR: round to nearest 9 or 0
 * @param {number} price - Price to round
 * @param {string} currency - Currency code
 * @returns {number} Rounded price
 */
export const roundToFriendlyPrice = (price, currency = 'INR') => {
  if (currency === 'USD') {
    // Round to nearest .99
    return Math.floor(price) + 0.99;
  }

  // For INR, round to nearest 9 ending
  const rounded = Math.round(price / 10) * 10;
  return rounded - 1; // e.g., 500 -> 499
};

/**
 * Parse price from string
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed price
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') {
    return priceString;
  }
  if (!priceString) {
    return 0;
  }
  // Remove currency symbols and commas
  const cleaned = String(priceString).replace(/[₹$,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Get shipping info based on cart total and currency
 * @param {number} cartTotal - Cart total in INR
 * @param {string} currency - Currency code
 * @param {number} exchangeRate - Exchange rate
 * @returns {object} Shipping info
 */
export const getShippingInfo = (cartTotal, currency = 'INR', exchangeRate = EXCHANGE_RATE) => {
  const freeShippingThresholdINR = 499;
  const shippingFeeINR = 39;

  const isFreeShipping = cartTotal >= freeShippingThresholdINR;
  const amountForFreeShipping = freeShippingThresholdINR - cartTotal;

  return {
    isFreeShipping,
    shippingFee: isFreeShipping ? 0 : shippingFeeINR,
    shippingFeeFormatted: isFreeShipping ? 'FREE' : formatPrice(shippingFeeINR, currency),
    amountForFreeShipping: Math.max(0, amountForFreeShipping),
    amountForFreeShippingFormatted: formatPrice(Math.max(0, amountForFreeShipping), currency),
    threshold: freeShippingThresholdINR,
    thresholdFormatted: formatPrice(freeShippingThresholdINR, currency),
  };
};

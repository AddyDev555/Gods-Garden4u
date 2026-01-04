import api, { cachedGet } from './axiosConfig';

// Cache keys
const CACHE_KEYS = {
  TOP_SELLING: 'gods_garden_cache_top_selling',
  NEW_ARRIVALS: 'gods_garden_cache_new_arrivals',
  CATEGORIES: 'gods_garden_cache_categories',
  INSTAGRAM: 'gods_garden_cache_instagram',
};

// Cache durations (in milliseconds)
const CACHE_DURATION = {
  PRODUCTS: 10 * 60 * 1000, // 10 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  INSTAGRAM: 30 * 60 * 1000, // 30 minutes
};

/**
 * Get top selling products
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Array>} Array of top selling products
 */
export const getTopSellingProducts = async (useCache = true) => {
  if (useCache) {
    const result = await cachedGet(
      '/get-top-selling-product/',
      CACHE_KEYS.TOP_SELLING,
      CACHE_DURATION.PRODUCTS
    );
    return result.data?.data || result.data || [];
  }
  const response = await api.get('/get-top-selling-product/');
  return response.data?.data || response.data || [];
};

/**
 * Get new arrival products
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Array>} Array of new arrival products
 */
export const getNewArrivalProducts = async (useCache = true) => {
  if (useCache) {
    const result = await cachedGet(
      '/get-new-arrival-product/',
      CACHE_KEYS.NEW_ARRIVALS,
      CACHE_DURATION.PRODUCTS
    );
    return result.data?.data || result.data || [];
  }
  const response = await api.get('/get-new-arrival-product/');
  return response.data?.data || response.data || [];
};

/**
 * Get products by IDs (for wishlist)
 * @param {Array<number>} productIds - Array of product IDs
 * @returns {Promise<Array>} Array of product details
 */
export const getProductsByIds = async (productIds) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  const response = await api.post('/get-products-by-ids/', {
    product_ids: productIds,
  });
  return response.data?.data || response.data || [];
};

/**
 * Get product categories
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Array>} Array of categories
 */
export const getProductCategories = async (useCache = true) => {
  if (useCache) {
    const result = await cachedGet(
      '/product-category/',
      CACHE_KEYS.CATEGORIES,
      CACHE_DURATION.CATEGORIES
    );
    return result.data?.data || result.data || [];
  }
  const response = await api.get('/product-category/');
  return response.data?.data || response.data || [];
};

/**
 * Get all products with optional category filter
 * @param {number|null} categoryPk - Category ID to filter by
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async (categoryPk = null) => {
  const url = categoryPk
    ? `/get-all-products/?category_pk=${categoryPk}`
    : '/get-all-products/';
  const response = await api.get(url);
  return response.data?.data || response.data || [];
};

/**
 * Get Instagram profile posts
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Array>} Array of Instagram posts
 */
export const getInstagramProfile = async (useCache = true) => {
  if (useCache) {
    const result = await cachedGet(
      '/instagram-profile/',
      CACHE_KEYS.INSTAGRAM,
      CACHE_DURATION.INSTAGRAM
    );
    return result.data?.data || result.data || [];
  }
  const response = await api.get('/instagram-profile/');
  return response.data?.data || response.data || [];
};

export { CACHE_KEYS };

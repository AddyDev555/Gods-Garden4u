import api from './axiosConfig';

/**
 * Register user for promotional offers
 * @param {string} firstName - User's first name
 * @param {string} mobileNumber - User's mobile number
 * @returns {Promise<Object>} Response with promo code details
 */
export const registerUserPromo = async (firstName, mobileNumber) => {
  const response = await api.post('/register-user-promo/', {
    first_name: firstName,
    mobile_number: mobileNumber,
  });
  return response.data;
};

/**
 * Subscribe to newsletter
 * @param {string} email - Email address to subscribe
 * @returns {Promise<Object>} Response with subscription status
 */
export const subscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/', {
    Email: email,
  });
  return response.data;
};

/**
 * Submit contact query
 * @param {Object} queryData - Query data
 * @param {string} queryData.name - User's name
 * @param {string} queryData.email - User's email
 * @param {string} queryData.mobile_number - User's phone number
 * @param {string} queryData.country_code - Country code (default: '91')
 * @param {string} queryData.query - User's message/query
 * @returns {Promise<Object>} Response with submission status
 */
export const submitContactQuery = async (queryData) => {
  const response = await api.post('/create-query/', {
    name: queryData.name,
    email: queryData.email,
    country_code: queryData.country_code || '91',
    mobile_number: queryData.mobile_number,
    query: queryData.query || queryData.message,
  });
  return response.data;
};

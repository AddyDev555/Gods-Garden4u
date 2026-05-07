import api from './axiosConfig';

/**
 * Fetch wishlist items for a user.
 * @param {number|string} userId
 * @returns {Promise<{ data: Array, total: number }>}
 */
export const getWishlist = async (userId) => {
  const response = await api.get('/get-wishlist/', {
    params: { user_id: userId },
  });
  return response.data;
};

/**
 * Add a product to wishlist.
 * @param {Object} payload
 * @param {number|string} payload.user_id
 * @param {number|string} payload.product_pk
 * @returns {Promise<Object>}
 */
export const addToWishlist = async ({ user_id, product_pk }) => {
  const response = await api.post('/add-to-wishlist/', {
    user_id,
    product_pk,
  });
  return response.data;
};

/**
 * Remove a wishlist item.
 * @param {Object} payload
 * @param {number|string} [payload.wishlist_id]
 * @param {number|string} [payload.user_id]
 * @param {number|string} [payload.product_pk]
 * @returns {Promise<Object>}
 */
export const removeWishlistItem = async ({ wishlist_id, user_id, product_pk }) => {
  const response = await api.post('/remove-wishlist-item/', {
    wishlist_id,
    user_id,
    product_pk,
  });
  return response.data;
};

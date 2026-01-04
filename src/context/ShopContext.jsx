import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../api/gods-garden/axiosConfig';
import { STORAGE_KEYS, CACHE_DURATION } from '../utils/constants';
import { storage, sessionStore, generateCartId, debounce } from '../utils/helpers';

// Create context
const ShopContext = createContext(null);

/**
 * ShopContextProvider - Manages cart and shop state
 */
export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  // Refs for request management
  const abortControllerRef = useRef(null);

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      // Get or create cart ID
      let savedCartId = storage.get(STORAGE_KEYS.CART_ID);
      if (!savedCartId) {
        savedCartId = generateCartId();
        storage.set(STORAGE_KEYS.CART_ID, savedCartId);
      }
      setCartId(savedCartId);

      // Try to load cached cart first
      const cachedCart = sessionStore.get(`cache_cart_${savedCartId}`);
      if (cachedCart && Date.now() - cachedCart.timestamp < CACHE_DURATION.CART) {
        setCartItems(cachedCart.data);
        setIsLoading(false);
        return;
      }

      // Fetch cart from server
      await fetchCartItems(savedCartId);
    };

    initCart();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch cart items from server
  const fetchCartItems = useCallback(async (id = cartId, forceRefresh = false) => {
    if (!id) return;

    // Check cache if not forcing refresh
    if (!forceRefresh) {
      const cachedCart = sessionStore.get(`cache_cart_${id}`);
      if (cachedCart && Date.now() - cachedCart.timestamp < CACHE_DURATION.CART) {
        setCartItems(cachedCart.data);
        setIsLoading(false);
        return;
      }
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/get-cart-items/?cart_id=${id}`, {
        signal: abortControllerRef.current.signal,
      });

      const items = response.data?.data || [];
      setCartItems(items);
      // Cache the result
      sessionStore.set(`cache_cart_${id}`, {
        data: items,
        timestamp: Date.now(),
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart');
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // Debounced fetch
  const debouncedFetch = useMemo(
    () => debounce(() => fetchCartItems(cartId, true), 300),
    [cartId, fetchCartItems]
  );

  // Add item to cart
  const addToCart = useCallback(
    async (productId, size, quantity = 1, offerPrice, mrp, isDirectBuy = false) => {
      if (!cartId) return { success: false, error: 'Cart not initialized' };

      setIsUpdating(true);
      setError(null);

      // Optimistic update
      const existingIndex = cartItems.findIndex(
        (item) => item.id === productId && item.size === size
      );

      const previousItems = [...cartItems];

      if (existingIndex >= 0) {
        // Update existing item
        setCartItems((prev) => {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        });
      } else {
        // Add new item (placeholder)
        setCartItems((prev) => [
          ...prev,
          {
            id: productId,
            size,
            quantity,
            offer_price: offerPrice,
            mrp,
            _pending: true,
          },
        ]);
      }

      try {
        const response = await api.post('/cart-items/', {
          cart_id: cartId,
          product_pk: productId,
          size,
          quantity,
          offer_price: offerPrice,
          mrp,
          is_direct_buy: isDirectBuy,
        });

        // Refresh cart to get accurate data
        await fetchCartItems(cartId, true);

        return { success: true, data: response.data };
      } catch (err) {
        // Rollback optimistic update
        setCartItems(previousItems);
        const errorMessage = err.response?.data?.error || 'Failed to add item to cart';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUpdating(false);
      }
    },
    [cartId, cartItems, fetchCartItems]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (productId, size, offerPrice, mrp, decrementOnly = false) => {
      if (!cartId) return { success: false, error: 'Cart not initialized' };

      setIsUpdating(true);
      setError(null);

      // Find item
      const itemIndex = cartItems.findIndex(
        (item) => item.id === productId && item.size === size
      );

      if (itemIndex === -1) {
        setIsUpdating(false);
        return { success: false, error: 'Item not found in cart' };
      }

      const previousItems = [...cartItems];

      // Optimistic update
      if (decrementOnly && cartItems[itemIndex].quantity > 1) {
        setCartItems((prev) => {
          const updated = [...prev];
          updated[itemIndex] = {
            ...updated[itemIndex],
            quantity: updated[itemIndex].quantity - 1,
          };
          return updated;
        });
      } else {
        setCartItems((prev) => prev.filter((_, i) => i !== itemIndex));
      }

      try {
        await api.post('/remove-cart-items/', {
          cart_id: cartId,
          product_pk: productId,
          size,
          offer_price: offerPrice,
          mrp,
        });

        // Refresh cart
        await fetchCartItems(cartId, true);

        return { success: true };
      } catch (err) {
        // Rollback
        setCartItems(previousItems);
        const errorMessage = err.response?.data?.error || 'Failed to remove item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUpdating(false);
      }
    },
    [cartId, cartItems, fetchCartItems]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId, size, newQuantity, offerPrice, mrp) => {
      if (newQuantity < 1) {
        return removeFromCart(productId, size, offerPrice, mrp);
      }

      const item = cartItems.find((i) => i.id === productId && i.size === size);
      if (!item) return { success: false, error: 'Item not found' };

      const diff = newQuantity - item.quantity;
      if (diff > 0) {
        return addToCart(productId, size, diff, offerPrice, mrp);
      } else if (diff < 0) {
        // Need to call remove multiple times or update API
        // For now, remove and re-add with new quantity
        setIsUpdating(true);
        const previousItems = [...cartItems];

        // Optimistic update
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === productId && i.size === size ? { ...i, quantity: newQuantity } : i
          )
        );

        // Note: The backend may not support direct quantity update
        // This is a workaround
        try {
          // Remove completely then add with new quantity
          for (let i = 0; i < Math.abs(diff); i++) {
            await api.post('/remove-cart-items/', {
              cart_id: cartId,
              product_pk: productId,
              size,
              offer_price: offerPrice,
              mrp,
            });
          }
          await fetchCartItems(cartId, true);
          return { success: true };
        } catch (err) {
          setCartItems(previousItems);
          return { success: false, error: 'Failed to update quantity' };
        } finally {
          setIsUpdating(false);
        }
      }

      return { success: true };
    },
    [cartId, cartItems, addToCart, removeFromCart, fetchCartItems]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    setCartItems([]);
    sessionStore.remove(`cache_cart_${cartId}`);

    // Generate new cart ID
    const newCartId = generateCartId();
    storage.set(STORAGE_KEYS.CART_ID, newCartId);
    setCartId(newCartId);
  }, [cartId]);

  // Validate promo code
  const validatePromoCode = useCallback(async (promoCode, amount, itemCount) => {
    try {
      const response = await api.post('/validate-promo-code/', {
        promo_code: promoCode,
        amount: amount.toString(),
        no_of_products: itemCount,
      });

      return {
        success: true,
        discount: response.data.discount || 0,
        data: response.data,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid promo code',
      };
    }
  }, []);

  // Calculate totals
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.offer_price || 0) * (item.quantity || 0),
      0
    );

    const originalTotal = cartItems.reduce(
      (sum, item) => sum + (item.mrp || item.offer_price || 0) * (item.quantity || 0),
      0
    );

    const savings = originalTotal - subtotal;
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return {
      subtotal,
      originalTotal,
      savings,
      itemCount,
    };
  }, [cartItems]);

  // Context value
  const value = useMemo(
    () => ({
      // State
      cartItems,
      cartId,
      isLoading,
      isUpdating,
      error,

      // Computed
      cartCount: cartTotals.itemCount,
      cartTotal: cartTotals.subtotal,
      cartTotals,

      // Methods
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCartItems: debouncedFetch,
      validatePromoCode,

      // Clear error
      clearError: () => setError(null),
    }),
    [
      cartItems,
      cartId,
      isLoading,
      isUpdating,
      error,
      cartTotals,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      debouncedFetch,
      validatePromoCode,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

/**
 * useShop hook
 * @returns {object} Shop context value
 */
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }
  return context;
};

export default ShopContext;

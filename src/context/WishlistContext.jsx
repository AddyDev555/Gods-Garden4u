import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { addToWishlist as apiAddToWishlist, removeWishlistItem as apiRemoveWishlistItem } from '../api/gods-garden/wishlistApi';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/helpers';

const getUserId = (user) => user?.id ?? user?.user_id ?? user?.pk ?? user?.uid ?? null;

// Create context
const WishlistContext = createContext(null);

/**
 * WishlistProvider - Manages wishlist state (client-side only)
 */
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Initialize wishlist from localStorage
  useEffect(() => {
    const savedWishlist = storage.get(STORAGE_KEYS.WISHLIST, []);
    setWishlistItems(savedWishlist);
    setIsLoading(false);
  }, []);

  // Persist wishlist to localStorage
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.WISHLIST, wishlistItems);
    }
  }, [wishlistItems, isLoading]);

  // Add item to wishlist
  const addToWishlist = useCallback(
    async (productId) => {
      if (!productId) {
        return { success: false, error: 'Product ID is required' };
      }

      if (wishlistItems.includes(productId)) {
        return { success: true, alreadyExists: true };
      }

      const userId = getUserId(user);
      if (isAuthenticated && userId) {
        try {
          await apiAddToWishlist({ user_id: userId, product_pk: productId });
        } catch (err) {
          console.error('Failed to add wishlist item:', err);
          return {
            success: false,
            error: err.response?.data?.error || err.message || 'Failed to add item to wishlist',
          };
        }
      }

      setWishlistItems((prev) => {
        if (prev.includes(productId)) {
          return prev;
        }
        return [...prev, productId];
      });

      return { success: true };
    },
    [isAuthenticated, user, wishlistItems]
  );

  // Remove item from wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!productId) {
        return { success: false, error: 'Product ID is required' };
      }

      const userId = getUserId(user);
      if (isAuthenticated && userId) {
        try {
          await apiRemoveWishlistItem({ user_id: userId, product_pk: productId });
        } catch (err) {
          console.error('Failed to remove wishlist item:', err);
          return {
            success: false,
            error: err.response?.data?.error || err.message || 'Failed to remove item from wishlist',
          };
        }
      }

      setWishlistItems((prev) => prev.filter((id) => id !== productId));
      return { success: true };
    },
    [isAuthenticated, user]
  );

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems]
  );

  // Toggle item in wishlist
  const toggleWishlist = useCallback(
    async (productId) => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      }
      return addToWishlist(productId);
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  // Get wishlist count
  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  // Context value
  const value = useMemo(
    () => ({
      // State
      wishlistItems,
      wishlistCount,
      isLoading,

      // Methods
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlistItems, wishlistCount, isLoading, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

/**
 * useWishlist hook
 * @returns {object} Wishlist context value
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;

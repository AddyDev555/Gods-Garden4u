import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/helpers';

// Create context
const WishlistContext = createContext(null);

/**
 * WishlistProvider - Manages wishlist state (client-side only)
 */
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const addToWishlist = useCallback((productId) => {
    setWishlistItems((prev) => {
      // Check if already in wishlist
      if (prev.includes(productId)) {
        return prev;
      }
      return [...prev, productId];
    });
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  // Toggle item in wishlist
  const toggleWishlist = useCallback((productId) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems]
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

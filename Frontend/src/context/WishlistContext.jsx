import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import wishlistService from '../services/wishlistService';
import productService from '../services/productService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set()); // Quick lookup map
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) return;
    setLoading(true);
    try {
      const res = await wishlistService.getWishlist();
      const rawList = res.data?.data || res.data?.wishlist || res.data || [];
      const wList = Array.isArray(rawList) ? rawList : [];

      const ids = new Set();
      const populatedItems = [];

      wList.forEach((item) => {
        if (!item) return;
        if (typeof item === 'object' && (item._id || item.id)) {
          const id = item._id || item.id;
          ids.add(id);
          // If it's a full populated product object with name/price
          if (item.name || item.ProductName) {
            populatedItems.push(item);
          }
        } else if (typeof item === 'string') {
          ids.add(item);
        }
      });

      setWishlistIds(ids);

      if (populatedItems.length === wList.length && wList.length > 0) {
        setWishlistProducts(populatedItems);
      } else if (wList.length > 0) {
        // Resolve from all products if items are just IDs
        const allProducts = await productService.getAllProducts();
        const products = Array.isArray(allProducts) ? allProducts : (allProducts.data || []);
        const resolved = Array.from(ids).map((id) => {
          return products.find((p) => (p._id === id || p.id === id));
        }).filter(Boolean);
        setWishlistProducts(resolved);
      } else {
        setWishlistProducts([]);
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist:", err);
      setWishlistIds(new Set());
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    if (!isAuthenticated || !isCustomer) return null;
    try {
      const res = await wishlistService.addToWishlist(productId);
      await fetchWishlist(); // Refresh to ensure sync
      return res;
    } catch (err) {
      console.error("Failed to add to wishlist", err);
      throw err;
    }
  }, [isAuthenticated, isCustomer, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated || !isCustomer) return null;
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      await fetchWishlist(); // Refresh
      return res;
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      throw err;
    }
  }, [isAuthenticated, isCustomer, fetchWishlist]);

  const toggleWishlist = useCallback(async (productId) => {
    if (wishlistIds.has(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  }, [wishlistIds, addToWishlist, removeFromWishlist]);

  const clearLocalWishlist = useCallback(() => {
    setWishlistProducts([]);
    setWishlistIds(new Set());
  }, []);

  const value = {
    wishlistProducts,
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    clearLocalWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;

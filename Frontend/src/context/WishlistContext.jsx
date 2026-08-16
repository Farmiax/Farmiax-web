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
      const wList = res.data?.wishlist || res.data || [];
      
      const newIds = new Set(wList.map((w) => w.product));
      setWishlistIds(newIds);
      
      if (wList.length === 0) {
        setWishlistProducts([]);
        return;
      }
      
      // Resolve full product details
      const allProducts = await productService.getAllProducts();
      const products = allProducts.data || [];
      const resolved = wList.map((item) => {
        const productDetail = products.find((p) => p._id === item.product);
        if (!productDetail) return null;
        return {
          ...productDetail,
          wishlistAddedAt: item.addedAt
        };
      }).filter(Boolean);
      
      setWishlistProducts(resolved);
      
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

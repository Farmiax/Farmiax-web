import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import productService from '../services/productService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cartData, setCartData] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when authenticated customer
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) return;
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCartData(res.data || {});
    } catch {
      setCartData({});
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Resolve cart product details
  useEffect(() => {
    const resolveProducts = async () => {
      const entries = Object.entries(cartData);
      if (entries.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        const allProducts = await productService.getAllProducts();
        const products = allProducts.data || [];
        const resolved = entries
          .map(([productId, cartInfo]) => {
            const product = products.find((p) => p._id === productId);
            if (!product) return null;
            return {
              ...product,
              cartQuantity: Number(cartInfo.quantity) || 1,
              cartDate: cartInfo.date,
            };
          })
          .filter(Boolean);
        setCartProducts(resolved);
      } catch {
        setCartProducts([]);
      }
    };

    if (Object.keys(cartData).length > 0) {
      resolveProducts();
    } else {
      setCartProducts([]);
    }
  }, [cartData]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const res = await cartService.addToCart(productId, quantity);
    setCartData(res.data || {});
    return res;
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    const res = await cartService.updateCart(productId, quantity);
    setCartData(res.data || {});
    return res;
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const res = await cartService.updateCart(productId, 0);
    setCartData(res.data || {});
    return res;
  }, []);

  const clearLocalCart = useCallback(() => {
    setCartData({});
    setCartProducts([]);
  }, []);

  const cartCount = Object.keys(cartData).length;

  const cartTotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  const value = {
    cartData,
    cartProducts,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCart,
    clearLocalCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

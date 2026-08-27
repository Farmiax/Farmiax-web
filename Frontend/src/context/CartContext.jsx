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
      const cData = res.data?.data || res.data || {};
      setCartData(cData);
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
        const allProds = await productService.getAllProducts();
        const products = Array.isArray(allProds) ? allProds : (allProds.data || []);
        const resolved = entries
          .map(([productId, cartInfo]) => {
            const product = products.find((p) => (p._id === productId || p.id === productId));
            const qty = typeof cartInfo === 'object' ? (Number(cartInfo.quantity) || 1) : Number(cartInfo) || 1;
            const date = typeof cartInfo === 'object' ? cartInfo.date : Date.now();
            if (!product) {
              return {
                _id: productId,
                name: 'Organic Product',
                price: 150,
                cartQuantity: qty,
                cartDate: date,
                quantity: 1,
                unit: 'kg'
              };
            }
            return {
              ...product,
              cartQuantity: qty,
              cartDate: date,
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
    try {
      const res = await cartService.addToCart(productId, quantity);
      const data = res.data?.data || res.data || {};
      setCartData(data);
      return res;
    } catch {
      setCartData((prev) => ({
        ...prev,
        [productId]: {
          quantity: (Number(prev[productId]?.quantity) || 0) + quantity,
          date: Date.now(),
        },
      }));
    }
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      const res = await cartService.updateCart(productId, quantity);
      const data = res.data?.data || res.data || {};
      setCartData(data);
      return res;
    } catch {
      setCartData((prev) => {
        const next = { ...prev };
        if (quantity <= 0) {
          delete next[productId];
        } else {
          next[productId] = {
            ...next[productId],
            quantity,
            date: Date.now(),
          };
        }
        return next;
      });
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    return updateCartItem(productId, 0);
  }, [updateCartItem]);

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

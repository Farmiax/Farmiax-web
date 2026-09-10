import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';
import productService from '../services/productService';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated || !auth.isCustomer) {
      return {};
    }
    try {
      const res = await cartService.getCart();
      return res.data?.data || res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch cart');
    }
  }
);

export const resolveCartProducts = createAsyncThunk(
  'cart/resolveCartProducts',
  async (cartData, { rejectWithValue }) => {
    const entries = Object.entries(cartData);
    if (entries.length === 0) {
      return [];
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
      return resolved;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to resolve products');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await cartService.addToCart(productId, quantity);
      return res.data?.data || res.data || {};
    } catch (err) {
      return rejectWithValue({ productId, quantity, date: Date.now() });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartService.updateCart(productId, quantity);
      return res.data?.data || res.data || {};
    } catch (err) {
      return rejectWithValue({ productId, quantity, date: Date.now() });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { dispatch }) => {
    return dispatch(updateCartItem({ productId, quantity: 0 })).unwrap();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartData: {},
    cartProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLocalCart: (state) => {
      state.cartData = {};
      state.cartProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.cartData = {};
        state.error = action.payload;
      })
      
      // Resolve Products
      .addCase(resolveCartProducts.fulfilled, (state, action) => {
        state.cartProducts = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartData = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId, quantity, date } = action.payload;
        state.cartData[productId] = {
          quantity: (Number(state.cartData[productId]?.quantity) || 0) + quantity,
          date,
        };
      })
      
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartData = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        const { productId, quantity, date } = action.payload;
        if (quantity <= 0) {
          delete state.cartData[productId];
        } else {
          state.cartData[productId] = {
            ...state.cartData[productId],
            quantity,
            date,
          };
        }
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;

export const selectCartCount = (state) => Object.keys(state.cart.cartData).length;
export const selectCartTotal = (state) => 
  state.cart.cartProducts.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

export default cartSlice.reducer;

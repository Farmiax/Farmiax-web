import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../services/wishlistService';
import productService from '../services/productService';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated || !auth.isCustomer) {
      return { wishlistProducts: [], wishlistIds: [] };
    }
    try {
      const res = await wishlistService.getWishlist();
      const rawList = res.data?.data || res.data?.wishlist || res.data || [];
      const wList = Array.isArray(rawList) ? rawList : [];

      const ids = [];
      const populatedItems = [];

      wList.forEach((item) => {
        if (!item) return;
        if (typeof item === 'object' && (item._id || item.id)) {
          const id = item._id || item.id;
          if (!ids.includes(id)) ids.push(id);
          // If it's a full populated product object with name/price
          if (item.name || item.ProductName) {
            populatedItems.push(item);
          }
        } else if (typeof item === 'string') {
          if (!ids.includes(item)) ids.push(item);
        }
      });

      if (populatedItems.length === wList.length && wList.length > 0) {
        return { wishlistProducts: populatedItems, wishlistIds: ids };
      } else if (wList.length > 0) {
        // Resolve from all products if items are just IDs
        const allProducts = await productService.getAllProducts();
        const products = Array.isArray(allProducts) ? allProducts : (allProducts.data || []);
        const resolved = ids.map((id) => {
          return products.find((p) => (p._id === id || p.id === id));
        }).filter(Boolean);
        return { wishlistProducts: resolved, wishlistIds: ids };
      } else {
        return { wishlistProducts: [], wishlistIds: [] };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const res = await wishlistService.addToWishlist(productId);
      await dispatch(fetchWishlist()); // Refresh to ensure sync
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      await dispatch(fetchWishlist()); // Refresh
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to remove from wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { getState, dispatch }) => {
    const { wishlistIds } = getState().wishlist;
    if (wishlistIds.includes(productId)) {
      return dispatch(removeFromWishlist(productId)).unwrap();
    } else {
      return dispatch(addToWishlist(productId)).unwrap();
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistProducts: [],
    wishlistIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLocalWishlist: (state) => {
      state.wishlistProducts = [];
      state.wishlistIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistProducts = action.payload.wishlistProducts;
        state.wishlistIds = action.payload.wishlistIds;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.wishlistProducts = [];
        state.wishlistIds = [];
      });
  },
});

export const { clearLocalWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

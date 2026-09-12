import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchInitialData = createAsyncThunk(
  'data/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const fetchWithFallback = async (promise) => {
        try {
          const res = await promise;
          return { status: 'fulfilled', value: res };
        } catch (err) {
          if (err.response?.status === 404) {
            return { status: 'fulfilled', value: { data: [] } };
          }
          return { status: 'rejected', reason: err };
        }
      };

      const [productsRes, farmersRes] = await Promise.all([
        fetchWithFallback(api.get('/product/all-products')),
        fetchWithFallback(api.get('/users/all-Farmers'))
      ]);

      let products = [];
      let farmers = [];

      if (productsRes.status === 'fulfilled') {
        const prods = productsRes.value.data?.data || productsRes.value.data?.products || productsRes.value.data || [];
        products = Array.isArray(prods) ? prods : [];
      } else {
        console.warn("Failed to load products:", productsRes.reason);
      }

      if (farmersRes.status === 'fulfilled') {
        const fetchedFarmers = farmersRes.value.data?.data || farmersRes.value.data?.allFarmer || farmersRes.value.data || [];
        if (Array.isArray(fetchedFarmers)) {
          farmers = fetchedFarmers.map((f, idx) => ({
            id: f._id || f.id || `farmer_${idx}`,
            name: f.fullName || f.name || 'Unnamed Farmer',
            farmName: f.farmName || f.City || 'Independent Farmer',
            location: [f.City, f.State].filter(Boolean).join(', ') || 'Unknown Location',
            rating: f.rating || 0,
            orders: f.ordersCount || 0,
            avatar: f.avatar && f.avatar !== 'Not Photo' ? f.avatar : null,
            coverImg: f.coverImg || null,
            isOrganic: f.isOrganic || false,
            rawObj: f
          }));
        }
      } else {
        console.warn("Failed to load farmers:", farmersRes.reason);
      }

      return { products, farmers };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    products: [],
    farmers: [],
    loading: true, // Wait for initial fetch
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.farmers = action.payload.farmers;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;

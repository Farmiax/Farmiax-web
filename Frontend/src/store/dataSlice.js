import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchInitialData = createAsyncThunk(
  'data/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, farmersRes] = await Promise.allSettled([
        api.get('/product/all-products'),
        api.get('/users/all-Farmers')
      ]);

      let products = [];
      let farmers = [];

      if (productsRes.status === 'fulfilled') {
        const prods = productsRes.value.data?.data || productsRes.value.data?.products || productsRes.value.data || [];
        products = Array.isArray(prods) ? prods : [];
      }

      if (farmersRes.status === 'fulfilled') {
        const fetchedFarmers = farmersRes.value.data?.data || farmersRes.value.data?.allFarmer || farmersRes.value.data || [];
        if (Array.isArray(fetchedFarmers)) {
          farmers = fetchedFarmers.map((f, idx) => ({
            id: f._id || f.id || `farmer_${idx}`,
            name: f.fullName || f.name || 'Organic Farmer',
            farmName: f.farmName || (f.City ? `${f.City} Fresh Organics` : 'Local Farmiax Organics'),
            location: [f.City, f.State].filter(Boolean).join(', ') || 'Tamil Nadu',
            rating: (4.7 + (idx % 3) * 0.1).toFixed(1),
            orders: 100 + idx * 45,
            avatar: f.avatar && f.avatar !== 'Not Photo' ? f.avatar : 'https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=200&q=80',
            coverImg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
            isOrganic: true,
            rawObj: f
          }));
        }
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData', 
  async (timeframe = 'till_now', { rejectWithValue }) => {
    try {
      const res = await api.get(`/owner/analytics?timeframe=${timeframe}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    timeframe: 'till_now', 
    stats: { totalRevenue: 0, totalOrders: 0 },
    trendData: [],
    topItems: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.trendData = action.payload.trend || []; 
        state.topItems = action.payload.topItems || []; 
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setTimeframe } = analyticsSlice.actions;
export default analyticsSlice.reducer;
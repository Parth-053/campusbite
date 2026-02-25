import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/owner/dashboard');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data');
  }
});

export const toggleCanteenStatus = createAsyncThunk('dashboard/toggleStatus', async (_, { rejectWithValue }) => {
  try {
    const res = await api.patch('/owner/dashboard/toggle-status');
    return res.data.data.isOpen; 
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to change status');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    isOpen: false, 
    stats: { totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 },
    recentOrders: [],
    revenueTrend: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setOptimisticStatus: (state, action) => {
      state.isOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {  
        if (state.stats.totalOrders === 0 && state.recentOrders.length === 0) {
          state.isLoading = true; 
        }
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOpen = action.payload.isOpen;
        state.stats = action.payload.stats || state.stats;
        state.recentOrders = action.payload.recentOrders || [];
        state.revenueTrend = action.payload.revenueTrend || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleCanteenStatus.fulfilled, (state, action) => {
        state.isOpen = action.payload;
      });
  }
});

export const { setOptimisticStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Async Thunk to simulate fetching LIVE dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      return {
        stats: {
          totalRevenue: 12500,
          totalOrders: 84,
          pendingOrders: 12,
          completedOrders: 65,
        },
        revenueTrend: [
          { time: '10am', value: 40 },
          { time: '11am', value: 65 },
          { time: '12pm', value: 90 },
          { time: '1pm', value: 85 },
          { time: '2pm', value: 45 },
          { time: '3pm', value: 60 },
          { time: '4pm', value: 30 },
        ],
        topItems: [
          { name: 'Veg Burger', percentage: 45, color: 'bg-orange-500' },
          { name: 'Cold Coffee', percentage: 30, color: 'bg-blue-500' },
          { name: 'Chicken Wrap', percentage: 15, color: 'bg-green-500' },
          { name: 'Fries', percentage: 10, color: 'bg-yellow-500' },
        ]
      };
    } catch  {
      return rejectWithValue('Failed to load dashboard data');
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  },
  revenueTrend: [],
  topItems: []
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.revenueTrend = action.payload.revenueTrend;
        state.topItems = action.payload.topItems;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Async Thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const totalOwnerCommission = 14500;
      const totalUserCommission = 3200;
      const totalProfit = totalOwnerCommission + totalUserCommission;
      
      // Mock Data (Replace with API response later)
      return {
        stats: {
          totalRevenue: 215000, // Overall money processed
          totalProfit: totalProfit, // Platform's total earnings
          totalColleges: 15,
          totalCanteens: 42,
          totalUsers: 5430,
          totalOrders: 28400,
          totalOwnerCommission: totalOwnerCommission, 
          totalUserCommission: totalUserCommission,   
        },
        ownerCommissionChart: [
          { label: 'Jan', value: 1200 }, { label: 'Feb', value: 1900 },
          { label: 'Mar', value: 1500 }, { label: 'Apr', value: 2200 },
          { label: 'May', value: 2800 }, { label: 'Jun', value: 2400 },
          { label: 'Jul', value: 3100 }
        ],
        userCommissionChart: [
          { label: 'Jan', value: 300 }, { label: 'Feb', value: 450 },
          { label: 'Mar', value: 380 }, { label: 'Apr', value: 500 },
          { label: 'May', value: 650 }, { label: 'Jun', value: 590 },
          { label: 'Jul', value: 800 }
        ]
      };
    } catch  {
      return rejectWithValue('Failed to load dashboard data');
    }
  }
);

const initialState = {
  data: null,
  isLoading: true, // Start true to show skeletons initially
  error: null,
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
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
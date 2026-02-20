import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- ASYNC THUNKS (Simulating Backend Aggregation) ---
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async (filters, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock Data Generation based on duration (to simulate dynamic backend filtering)
      let multiplier = 30; // Default (This Month)
      switch (filters.duration) {
        case 'Today':
        case 'Yesterday':
        case 'Custom':
          multiplier = 1;
          break;
        case 'Last Week':
          multiplier = 7;
          break;
        case 'This Year':
          multiplier = 365;
          break;
        case 'All Time':
          multiplier = 1000;
          break;
        default:
          multiplier = 30;
      }
      
      return {
        // Key Performance Indicators
        kpis: {
          revenue: { value: 15400 * multiplier, trend: 12.5 }, 
          profit: { value: 1078 * multiplier, trend: 15.2 },   
          orders: { value: 124 * multiplier, trend: -2.4 },    
          aov: { value: 124, trend: 5.1 },                     
        },
        // Chart Data
        revenueTrend: [
          { label: 'Point 1', value: 1200 * multiplier },
          { label: 'Point 2', value: 1900 * multiplier },
          { label: 'Point 3', value: 1500 * multiplier },
          { label: 'Point 4', value: 2200 * multiplier },
          { label: 'Point 5', value: 2800 * multiplier },
          { label: 'Point 6', value: 2400 * multiplier },
          { label: 'Point 7', value: 3100 * multiplier }
        ],
        // Top Performers
        topCanteens: [
          { id: 'c1', name: 'Tech Bites', revenue: 6500 * multiplier, percentage: 42 },
          { id: 'c2', name: 'Delhi Cafe', revenue: 4500 * multiplier, percentage: 29 },
          { id: 'c3', name: 'Coffee Hub', revenue: 3000 * multiplier, percentage: 19 },
          { id: 'c4', name: 'Mumbai Snacks', revenue: 1400 * multiplier, percentage: 10 }
        ],
        // Top Items
        topItems: [
          { name: 'Cold Coffee', orders: 45 * multiplier },
          { name: 'Masala Dosa', orders: 38 * multiplier },
          { name: 'Veg Burger', orders: 32 * multiplier },
          { name: 'French Fries', orders: 28 * multiplier },
        ]
      };
    } catch  {
      return rejectWithValue('Failed to load analytics');
    }
  }
);

const initialState = {
  data: null,
  isLoading: true,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default analyticsSlice.reducer;
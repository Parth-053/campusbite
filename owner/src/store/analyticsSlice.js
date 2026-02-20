import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data Generator with Dynamic Chart Logic
const generateMockData = (filter) => {
  const multiplier = filter === 'Today' ? 1 : filter === 'Yesterday' ? 0.9 : filter === 'Last Week' ? 5 : 20;
  
  let revenueTrend = [];

  // Dynamic Chart Data based on Filter
  switch (filter) {
    case 'Today':
    case 'Yesterday':
      // Hourly Data
      revenueTrend = [
        { label: '10am', value: 40 }, { label: '11am', value: 65 },
        { label: '12pm', value: 90 }, { label: '1pm', value: 85 },
        { label: '2pm', value: 45 }, { label: '3pm', value: 60 },
        { label: '4pm', value: 30 }, { label: '5pm', value: 50 },
      ];
      break;
    
    case 'Last Week':
      // Daily Data
      revenueTrend = [
        { label: 'Mon', value: 300 }, { label: 'Tue', value: 450 },
        { label: 'Wed', value: 320 }, { label: 'Thu', value: 500 },
        { label: 'Fri', value: 600 }, { label: 'Sat', value: 400 },
        { label: 'Sun', value: 350 },
      ];
      break;

    case 'Last Month':
    case 'Last 3 Months':
      // Weekly Data
      revenueTrend = [
        { label: 'Week 1', value: 2500 }, { label: 'Week 2', value: 3200 },
        { label: 'Week 3', value: 2800 }, { label: 'Week 4', value: 3500 },
      ];
      break;

    case 'Last 6 Months':
    case 'Last Year':
    case 'Total':
      // Monthly Data
      revenueTrend = [
        { label: 'Jan', value: 12000 }, { label: 'Feb', value: 15000 },
        { label: 'Mar', value: 11000 }, { label: 'Apr', value: 18000 },
        { label: 'May', value: 14000 }, { label: 'Jun', value: 16000 },
      ];
      break;

    default:
      revenueTrend = [];
  }

  return {
    stats: {
      totalRevenue: Math.floor(12500 * multiplier),
      totalOrders: Math.floor(84 * multiplier),
    },
    revenueTrend,
    topItems: [
      { name: 'Veg Burger', orders: Math.floor(120 * multiplier), percentage: 45, color: 'bg-orange-500' },
      { name: 'Cold Coffee', orders: Math.floor(95 * multiplier), percentage: 30, color: 'bg-blue-500' },
      { name: 'Chicken Wrap', orders: Math.floor(50 * multiplier), percentage: 15, color: 'bg-green-500' },
      { name: 'Fries', orders: Math.floor(30 * multiplier), percentage: 10, color: 'bg-yellow-500' },
      { name: 'Pizza Slice', orders: Math.floor(15 * multiplier), percentage: 5, color: 'bg-red-500' },
    ]
  };
};

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async (filter, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return generateMockData(filter);
    } catch  {
      return rejectWithValue('Failed to load analytics');
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  filter: 'Total',
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
  },
  revenueTrend: [],
  topItems: []
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.revenueTrend = action.payload.revenueTrend;
        state.topItems = action.payload.topItems;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setAnalyticsFilter } = analyticsSlice.actions;
export default analyticsSlice.reducer;
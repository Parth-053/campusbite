import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE (Simulating Backend) ---
const MOCK_CANTEENS = [
  { 
    id: 'can_1', 
    name: 'Tech Bites', 
    college: 'Pune Institute of Technology', 
    hostel: 'Boys Hostel A',
    openTime: '08:00 AM',
    closeTime: '10:00 PM',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'can_2', 
    name: 'Healthy Bowl', 
    college: 'Pune Institute of Technology',
    hostel: 'Sports Complex',
    openTime: '07:00 AM',
    closeTime: '08:00 PM',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 'can_3', 
    name: 'Late Night Craves', 
    college: 'Pune Institute of Technology',
    hostel: 'Girls Hostel B',
    openTime: '09:00 PM',
    closeTime: '03:00 AM',
    isOpen: false, // Currently closed
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
  }
];

export const fetchCanteens = createAsyncThunk('canteen/fetchCanteens', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return MOCK_CANTEENS;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch canteens');
  }
});

const canteenSlice = createSlice({
  name: 'canteen',
  initialState: { canteens: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanteens.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCanteens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.canteens = action.payload;
      })
      .addCase(fetchCanteens.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      });
  }
});

export default canteenSlice.reducer;
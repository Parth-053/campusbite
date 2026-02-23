import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCanteens = createAsyncThunk('canteen/fetchCanteens', async (collegeId, { rejectWithValue }) => {
  try {
    if (!collegeId) return [];

    const res = await api.get(`/canteens/common/${collegeId}`);
    return res.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch canteens');
  }
});

const canteenSlice = createSlice({
  name: 'canteen',
  initialState: { canteens: [], isLoading: false, error: null },
  reducers: {
    clearCanteens: (state) => {
      state.canteens = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanteens.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(fetchCanteens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.canteens = action.payload; // Set real data from MongoDB
      })
      .addCase(fetchCanteens.rejected, (state, action) => {
        state.isLoading = false; 
        state.error = action.payload;
      });
  }
});

export const { clearCanteens } = canteenSlice.actions;
export default canteenSlice.reducer;
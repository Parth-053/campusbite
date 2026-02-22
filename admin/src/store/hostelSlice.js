import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchHostels = createAsyncThunk('hostel/fetchHostels', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/locations/admin/hostels'); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addNewHostel = createAsyncThunk('hostel/addNewHostel', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/locations/admin/hostels', data); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const editHostel = createAsyncThunk('hostel/editHostel', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/locations/admin/hostels/${id}`, data); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteHostel = createAsyncThunk('hostel/deleteHostel', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/locations/admin/hostels/${id}`); 
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleHostelStatus = createAsyncThunk('hostel/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/locations/admin/hostels/${id}/status`); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const hostelSlice = createSlice({
  name: 'hostel',
  initialState: {
    hostels: [], 
    dropdownColleges: [], 
    totalHostels: 0, 
    activeHostels: 0,
    isLoading: false, 
    isActionLoading: false, 
    error: null,
  },
  reducers: {
    clearDropdownColleges: (state) => { state.dropdownColleges = []; }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchHostels.pending, (state) => { state.isLoading = true; })
      .addCase(fetchHostels.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.hostels = action.payload;
        state.totalHostels = action.payload.length;
        state.activeHostels = action.payload.filter(h => h.isActive).length;
      })
      .addCase(toggleHostelStatus.fulfilled, (state, action) => {
        const index = state.hostels.findIndex(h => h._id === action.payload._id);
        if (index !== -1) {
          const oldStatus = state.hostels[index].isActive;
          state.hostels[index].isActive = action.payload.isActive;
          if (oldStatus === true && action.payload.isActive === false) state.activeHostels -= 1;
          if (oldStatus === false && action.payload.isActive === true) state.activeHostels += 1;
        }
      })
      .addCase(deleteHostel.fulfilled, (state, action) => {
        const hostel = state.hostels.find(h => h._id === action.payload);
        if (hostel) {
          if (hostel.isActive) state.activeHostels -= 1;
          state.totalHostels -= 1;
          state.hostels = state.hostels.filter(h => h._id !== action.payload);
        }
      });
  }
});
export const { clearDropdownColleges } = hostelSlice.actions;
export default hostelSlice.reducer;
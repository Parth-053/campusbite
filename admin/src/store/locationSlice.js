import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchStates = createAsyncThunk('location/fetchStates', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/locations/common/states');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch states');
  }
});

export const fetchDistricts = createAsyncThunk('location/fetchDistricts', async (stateId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/districts/${stateId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch districts');
  }
});

export const fetchPublicColleges = createAsyncThunk('location/fetchPublicColleges', async (districtId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/colleges/${districtId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch public colleges');
  }
});

export const fetchPublicHostels = createAsyncThunk('location/fetchPublicHostels', async (collegeId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/hostels/${collegeId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch public hostels');
  }
});


const locationSlice = createSlice({
  name: 'location',
  initialState: {
    // Only Dropdown Data
    states: [],
    districts: [],
    publicColleges: [],
    publicHostels: [], // Added for Owner/Customer logic
    
    // UI States
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDistricts: (state) => { 
      state.districts = []; 
      state.publicColleges = []; 
      state.publicHostels = [];
    },
    clearPublicColleges: (state) => { 
      state.publicColleges = []; 
      state.publicHostels = [];
    },
    clearPublicHostels: (state) => {
      state.publicHostels = [];
    },
    clearError: (state) => { 
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State for States (as it loads initially)
      .addCase(fetchStates.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(fetchStates.fulfilled, (state, action) => { 
        state.isLoading = false;
        state.states = action.payload; 
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // District, College, Hostel fulfilled states
      .addCase(fetchDistricts.fulfilled, (state, action) => { state.districts = action.payload; })
      .addCase(fetchPublicColleges.fulfilled, (state, action) => { state.publicColleges = action.payload; })
      .addCase(fetchPublicHostels.fulfilled, (state, action) => { state.publicHostels = action.payload; });
  }
});

export const { clearDistricts, clearPublicColleges, clearPublicHostels, clearError } = locationSlice.actions;
export default locationSlice.reducer;
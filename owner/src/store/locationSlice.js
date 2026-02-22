import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchStates = createAsyncThunk('location/fetchStates', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/locations/common/states');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchDistricts = createAsyncThunk('location/fetchDistricts', async (stateId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/districts/${stateId}`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchColleges = createAsyncThunk('location/fetchPublicColleges', async (districtId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/colleges/${districtId}`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchHostels = createAsyncThunk('location/fetchPublicHostels', async (collegeId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/locations/common/hostels/${collegeId}`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    states: [],
    districts: [],
    colleges: [],
    hostels: [],
    isLoading: false,
  },
  reducers: {
    clearDistricts: (state) => { state.districts = []; state.colleges = []; state.hostels = []; },
    clearColleges: (state) => { state.colleges = []; state.hostels = []; },
    clearHostels: (state) => { state.hostels = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.fulfilled, (state, action) => { state.states = action.payload; })
      .addCase(fetchDistricts.fulfilled, (state, action) => { state.districts = action.payload; })
      .addCase(fetchColleges.fulfilled, (state, action) => { state.colleges = action.payload; })
      .addCase(fetchHostels.fulfilled, (state, action) => { state.hostels = action.payload; });
  }
});

export const { clearDistricts, clearColleges, clearHostels } = locationSlice.actions;
export default locationSlice.reducer;
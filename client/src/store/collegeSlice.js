import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchColleges = createAsyncThunk('college/fetchColleges', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/locations/admin/colleges'); return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addNewCollege = createAsyncThunk('college/addNewCollege', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/locations/admin/colleges', data); return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const editCollege = createAsyncThunk('college/editCollege', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/locations/admin/colleges/${id}`, data); return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteCollege = createAsyncThunk('college/deleteCollege', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/locations/admin/colleges/${id}`); return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleCollegeStatus = createAsyncThunk('college/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/locations/admin/colleges/${id}/status`); return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const collegeSlice = createSlice({
  name: 'college',
  initialState: {
    // Note: Used 'adminColleges' instead of 'colleges' to prevent undefined errors in your UI
    adminColleges: [], states: [], districts: [], 
    totalColleges: 0, activeColleges: 0,
    isLoading: false, isActionLoading: false, error: null,
  },
  reducers: {
    clearDistricts: (state) => { state.districts = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColleges.pending, (state) => { state.isLoading = true; })
      .addCase(fetchColleges.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.adminColleges = action.payload;
        state.totalColleges = action.payload.length;
        state.activeColleges = action.payload.filter(c => c.isActive).length;
      })
      // Toggle Status
      .addCase(toggleCollegeStatus.fulfilled, (state, action) => {
        const index = state.adminColleges.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          const oldStatus = state.adminColleges[index].isActive;
          state.adminColleges[index].isActive = action.payload.isActive;
          if (oldStatus === true && action.payload.isActive === false) state.activeColleges -= 1;
          if (oldStatus === false && action.payload.isActive === true) state.activeColleges += 1;
        }
      })
      // Delete
      .addCase(deleteCollege.fulfilled, (state, action) => {
        const college = state.adminColleges.find(c => c._id === action.payload);
        if (college) {
          if (college.isActive) state.activeColleges -= 1;
          state.totalColleges -= 1;
          state.adminColleges = state.adminColleges.filter(c => c._id !== action.payload);
        }
      });
  }
});

export const { clearDistricts } = collegeSlice.actions;
export default collegeSlice.reducer;
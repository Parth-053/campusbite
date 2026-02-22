import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCanteens = createAsyncThunk('canteen/fetchAdminCanteens', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/canteens/admin'); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOwnerStatus = createAsyncThunk('canteen/updateOwnerStatus', async ({ ownerId, status }, { rejectWithValue }) => {
  try { const res = await api.patch(`/admin/owners/${ownerId}/status`, { status }); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleBanOwner = createAsyncThunk('canteen/toggleBanOwner', async (ownerId, { rejectWithValue }) => {
  try { const res = await api.patch(`/admin/owners/${ownerId}/ban`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteCanteen = createAsyncThunk('canteen/deleteCanteen', async (id, { rejectWithValue }) => {
  try { await api.delete(`/canteens/admin/${id}`); return id; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleCanteenStatus = createAsyncThunk('canteen/toggleCanteenStatus', async (id, { rejectWithValue }) => {
  try { const res = await api.patch(`/canteens/admin/${id}/status`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchCanteenById = createAsyncThunk('canteen/fetchById', async (id, { getState }) => {
  const { adminCanteens } = getState().canteen;
  const canteen = adminCanteens.find(c => c._id === id);
  return canteen || null;
});

const canteenSlice = createSlice({
  name: 'canteen',
  initialState: { adminCanteens: [], currentCanteen: null, isLoading: false, isDetailLoading: false, error: null },
  reducers: { clearCurrentCanteen: (state) => { state.currentCanteen = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanteens.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCanteens.fulfilled, (state, action) => { state.isLoading = false; state.adminCanteens = action.payload; })
      .addCase(fetchCanteens.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(deleteCanteen.fulfilled, (state, action) => { state.adminCanteens = state.adminCanteens.filter(c => c._id !== action.payload); })
      
      .addCase(toggleCanteenStatus.fulfilled, (state, action) => {
        const index = state.adminCanteens.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.adminCanteens[index].isActive = action.payload.isActive;
        if (state.currentCanteen && state.currentCanteen._id === action.payload._id) state.currentCanteen.isActive = action.payload.isActive;
      })
       
      .addCase(updateOwnerStatus.fulfilled, (state, action) => {
        const updatedOwner = action.payload;
        const index = state.adminCanteens.findIndex(c => c.owner?._id === updatedOwner._id);
        if (index !== -1) {
          state.adminCanteens[index].owner.status = updatedOwner.status; 
          state.adminCanteens[index].isActive = (updatedOwner.status === 'approved');
        }
        if (state.currentCanteen && state.currentCanteen.owner?._id === updatedOwner._id) {
          state.currentCanteen.owner.status = updatedOwner.status;
          state.currentCanteen.isActive = (updatedOwner.status === 'approved');
        }
      })
 
      .addCase(toggleBanOwner.fulfilled, (state, action) => {
        const updatedOwner = action.payload;
        const index = state.adminCanteens.findIndex(c => c.owner?._id === updatedOwner._id);
        if (index !== -1) {
          state.adminCanteens[index].owner.isBanned = updatedOwner.isBanned; 
          if (updatedOwner.isBanned) {
            state.adminCanteens[index].isActive = false;
          } else if (updatedOwner.status === 'approved') {
            state.adminCanteens[index].isActive = true;
          }
        }
        if (state.currentCanteen && state.currentCanteen.owner?._id === updatedOwner._id) {
          state.currentCanteen.owner.isBanned = updatedOwner.isBanned;
          if (updatedOwner.isBanned) {
            state.currentCanteen.isActive = false;
          } else if (updatedOwner.status === 'approved') {
            state.currentCanteen.isActive = true;
          }
        }
      })
      
      .addCase(fetchCanteenById.pending, (state) => { state.isDetailLoading = true; })
      .addCase(fetchCanteenById.fulfilled, (state, action) => { state.isDetailLoading = false; state.currentCanteen = action.payload; });
  }
});
export const { clearCurrentCanteen } = canteenSlice.actions;
export default canteenSlice.reducer;
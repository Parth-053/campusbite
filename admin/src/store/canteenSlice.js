import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ==========================================================
// 🍔 ADMIN CANTEEN APIs (Using Real Backend)
// ==========================================================

export const fetchCanteens = createAsyncThunk('canteen/fetchAdminCanteens', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/canteens/admin'); // 👈 Match backend route
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addNewCanteen = createAsyncThunk('canteen/addNewCanteen', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/canteens/admin', data); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const editCanteen = createAsyncThunk('canteen/editCanteen', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/canteens/admin/${id}`, data); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteCanteen = createAsyncThunk('canteen/deleteCanteen', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/canteens/admin/${id}`); 
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleCanteenStatus = createAsyncThunk('canteen/toggleCanteenStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/canteens/admin/${id}/status`); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// --- STATIC STUFF RETAINED FOR DETAIL PAGE ---
export const fetchCanteenById = createAsyncThunk('canteen/fetchById', async (id) => {
  return { id, name: "Sample Canteen", menu: [], transactions: [] }; // Mock for detail page
});
export const updateMenuItem = createAsyncThunk('canteen/updateMenuItem', async (data) => data);


const canteenSlice = createSlice({
  name: 'canteen',
  initialState: {
    adminCanteens: [], 
    currentCanteen: null,
    isLoading: false, 
    isActionLoading: false, 
    isDetailLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCanteen: (state) => { state.currentCanteen = null; }
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.isLoading = true; state.error = null; };
    const setActionLoading = (state) => { state.isActionLoading = true; state.error = null; };
    const setActionDone = (state) => { state.isActionLoading = false; };
    const setError = (state, action) => { state.isLoading = false; state.isActionLoading = false; state.error = action.payload; };

    builder
      .addCase(fetchCanteens.pending, setLoading)
      .addCase(fetchCanteens.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.adminCanteens = action.payload; 
      })
      .addCase(fetchCanteens.rejected, setError)
      
      .addCase(addNewCanteen.pending, setActionLoading)
      .addCase(addNewCanteen.fulfilled, setActionDone)
      .addCase(addNewCanteen.rejected, setError)
      
      .addCase(editCanteen.pending, setActionLoading)
      .addCase(editCanteen.fulfilled, setActionDone)
      .addCase(editCanteen.rejected, setError)
      
      .addCase(deleteCanteen.fulfilled, (state, action) => { 
        state.adminCanteens = state.adminCanteens.filter(c => c._id !== action.payload); 
      })
      .addCase(deleteCanteen.rejected, setError)

      .addCase(toggleCanteenStatus.fulfilled, (state, action) => {
        const index = state.adminCanteens.findIndex(c => c._id === action.payload._id);
        if (index !== -1) { state.adminCanteens[index].isActive = action.payload.isActive; }
      })

      // Detail page mocks
      .addCase(fetchCanteenById.pending, (state) => { state.isDetailLoading = true; })
      .addCase(fetchCanteenById.fulfilled, (state, action) => {
        state.isDetailLoading = false; state.currentCanteen = action.payload;
      });
  }
});

export const { clearCurrentCanteen } = canteenSlice.actions;
export default canteenSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';
 
export const fetchMenuItems = createAsyncThunk('menu/fetchAll', async (params = {}, { rejectWithValue }) => {
  try { 
    const res = await api.get('/menu', { params }); 
    return res.data.data; 
  } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch menus'); }
});
 
export const fetchCategories = createAsyncThunk('menu/fetchCategories', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/categories/owner/active'); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories'); }
});

export const addMenuItem = createAsyncThunk('menu/add', async (formData, { rejectWithValue }) => {
  try { const res = await api.post('/menu', formData); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add item'); }
});

export const updateMenuItem = createAsyncThunk('menu/update', async ({ id, formData }, { rejectWithValue }) => {
  try { const res = await api.patch(`/menu/${id}`, formData); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update item'); }
});

export const toggleAvailability = createAsyncThunk('menu/toggle', async (id, { rejectWithValue }) => {
  try { const res = await api.patch(`/menu/${id}/toggle`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to toggle'); }
});

export const deleteMenuItem = createAsyncThunk('menu/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/menu/${id}`); return id; } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete'); }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], categories: [], isLoading: false, isActionLoading: false },
  reducers: {
    optimisticToggle: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item) item.isAvailable = !item.isAvailable;
    },
    optimisticDelete: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMenuItems.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchMenuItems.rejected, (state) => { state.isLoading = false; })
      
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })

      .addCase(addMenuItem.pending, (state) => { state.isActionLoading = true; })
      .addCase(addMenuItem.fulfilled, (state, action) => { state.isActionLoading = false; state.items.unshift(action.payload); toast.success('Item Added Successfully'); })
      .addCase(addMenuItem.rejected, (state) => { state.isActionLoading = false; })

      .addCase(updateMenuItem.pending, (state) => { state.isActionLoading = true; })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        toast.success('Item Updated Successfully');
      })
      .addCase(updateMenuItem.rejected, (state) => { state.isActionLoading = false; })
      
      .addCase(toggleAvailability.rejected, (state, action) => {
        const item = state.items.find(i => i._id === action.meta.arg);
        if (item) item.isAvailable = !item.isAvailable;
        toast.error('Failed to update availability');
      });
  }
});

export const { optimisticToggle, optimisticDelete } = menuSlice.actions;
export default menuSlice.reducer;
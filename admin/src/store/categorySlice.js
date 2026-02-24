import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const fetchCategories = createAsyncThunk('category/fetchAll', async (_, { rejectWithValue }) => {
  try {
    // 🚀 FIXED: Route changed from '/categories' to '/categories/admin'
    const res = await api.get('/categories/admin');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
  }
});

// FormData is automatically handled by Axios
export const createCategory = createAsyncThunk('category/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/categories/admin', formData);
    toast.success("Category created successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create category");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCategory = createAsyncThunk('category/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/categories/admin/${id}`, formData);
    toast.success("Category updated successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update category");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteCategory = createAsyncThunk('category/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/admin/${id}`);
    toast.success("Category deleted successfully");
    return id;
  } catch (err) {
    toast.error("Failed to delete category");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleCategoryStatus = createAsyncThunk('category/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/categories/admin/${id}/status`);
    toast.success("Status updated");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update status");
    return rejectWithValue(err.response?.data?.message);
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: { categories: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.isLoading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(createCategory.fulfilled, (state, action) => { state.categories.unshift(action.payload); })
      
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })
      
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      })
      
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.categories[index].isActive = action.payload.isActive;
      });
  }
});

export default categorySlice.reducer;
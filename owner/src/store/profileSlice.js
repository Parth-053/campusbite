// owner/src/store/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { restoreSession } from './authSlice'; 

// Handle FormData for Image Uploads properly
export const updateProfileData = createAsyncThunk('profile/updateData', async (updatedData, { rejectWithValue, dispatch }) => {
  try {
    const config = updatedData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } } 
      : {};

    const res = await api.patch('/profiles/owner', updatedData, config);
    dispatch(restoreSession()); 
    return res.data.data;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile.'); 
  }
});

// 🚀 FIXED: Removed unused 'rejectWithValue'
export const updateStoreImage = createAsyncThunk('profile/updateImage', async (imageUrl) => {
  return imageUrl; 
});

export const logoutUser = createAsyncThunk('profile/logout', async (_, { rejectWithValue }) => {
  try { await new Promise(resolve => setTimeout(resolve, 500)); return true; } 
  catch  { return rejectWithValue('Logout failed'); }
});

export const deleteAccount = createAsyncThunk('profile/deleteAccount', async (_, { rejectWithValue, dispatch }) => {
  try { 
    await api.delete('/profiles/owner'); 
    dispatch(logoutUser()); 
    return true; 
  } 
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete account.'); }
});

const initialState = { isEditing: false, activeTab: 'personal', isLoading: false, error: null, successMessage: null };

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggleEdit: (state) => { state.isEditing = !state.isEditing; },
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    resetProfileStatus: (state) => { state.isEditing = false; state.error = null; state.successMessage = null; state.isLoading = false; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileData.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfileData.fulfilled, (state) => { state.isLoading = false; state.isEditing = false; state.successMessage = "Profile updated successfully!"; })
      .addCase(updateProfileData.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; })
      .addCase(logoutUser.fulfilled, (state) => { state.isLoading = false; state.activeTab = 'personal'; })
      
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAccount.fulfilled, (state) => { state.isLoading = false; })
      .addCase(deleteAccount.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export const { toggleEdit, setActiveTab, resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
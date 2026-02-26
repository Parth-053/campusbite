import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { auth } from '../config/firebase';
import { fetchCustomerProfile, logoutLocal } from './authSlice';

// 1. UPDATE PROFILE
export const updateUserProfile = createAsyncThunk('profile/updateProfile', async (formData, { rejectWithValue, dispatch }) => {
  try { 
    const user = auth.currentUser;
    if (!user) throw new Error("No active user");
     
    const token = await user.getIdToken(true);
    const res = await api.patch('/profiles/customer', formData, {
       headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'Customer' }
    });
     
    dispatch(fetchCustomerProfile(token));
    
    return res.data.data;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || "Failed to update profile"); 
  }
});

// 2. DELETE ACCOUNT
export const deleteAccount = createAsyncThunk('profile/deleteAccount', async (_, { rejectWithValue, dispatch }) => {
  try { 
    const user = auth.currentUser;
    if (!user) throw new Error("No active user");
    
    const token = await user.getIdToken();
    await api.delete('/profiles/customer', {
       headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'Customer' }
    }); 

    await auth.signOut();
    dispatch(logoutLocal());
    
    return true;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || "Failed to delete account"); 
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { 
    isLoading: false, 
    error: null, 
    successMessage: null 
  },
  reducers: {
    clearProfileState: (state) => { 
      state.error = null; 
      state.successMessage = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => { state.isLoading = true; state.error = null; state.successMessage = null; })
      .addCase(updateUserProfile.fulfilled, (state) => { state.isLoading = false; state.successMessage = "Profile updated successfully!"; })
      .addCase(updateUserProfile.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAccount.fulfilled, (state) => { state.isLoading = false; })
      .addCase(deleteAccount.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'; 
import { restoreSession, logoutOwner } from './authSlice'; 

 
export const fetchFullProfile = createAsyncThunk('profile/fetchFull', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/profiles/owner');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch full profile.');
  }
});

// 1. UPDATE PROFILE DATA
export const updateProfileData = createAsyncThunk('profile/updateData', async (updatedData, { rejectWithValue, dispatch }) => {
  try {
    const res = await api.patch('/profiles/owner', updatedData);
    dispatch(restoreSession()); 
    return res.data.data;  
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile.'); 
  }
});

// 2. DELETE ACCOUNT
export const deleteAccount = createAsyncThunk('profile/deleteAccount', async (_, { rejectWithValue, dispatch }) => {
  try { 
    await api.delete('/profiles/owner');  
    dispatch(logoutOwner()); 
    return true; 
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to delete account.'); 
  }
});

const initialState = { 
  profileData: null,  
  isEditing: false, 
  activeTab: 'personal', 
  isLoading: false, 
  error: null, 
  successMessage: null 
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggleEdit: (state) => { state.isEditing = !state.isEditing; },
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    resetProfileStatus: (state) => { 
      state.isEditing = false; 
      state.error = null; 
      state.successMessage = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH FULL PROFILE
      .addCase(fetchFullProfile.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFullProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload; 
      })
      .addCase(fetchFullProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfileData.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfileData.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.isEditing = false; 
        state.profileData = action.payload;  
        state.successMessage = "Profile updated successfully!"; 
      })
      .addCase(updateProfileData.rejected, (state, action) => { 
        state.isLoading = false; 
        state.error = action.payload; 
      })
      
      // DELETE ACCOUNT
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAccount.fulfilled, (state) => { 
        state.isLoading = false; 
        state.activeTab = 'personal';
        state.profileData = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => { 
        state.isLoading = false; 
        state.error = action.payload; 
      })
 
      // LOGOUT
      .addCase(logoutOwner.fulfilled, (state) => { 
        state.activeTab = 'personal'; 
        state.isEditing = false;
        state.error = null;
        state.successMessage = null;
        state.profileData = null;
      });
  }
});

export const { toggleEdit, setActiveTab, resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
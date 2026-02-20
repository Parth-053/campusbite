import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- ASYNC THUNKS ---

export const updateProfileData = createAsyncThunk(
  'profile/updateData',
  async (updatedData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updatedData;
    } catch  {
      return rejectWithValue('Failed to update profile.');
    }
  }
);

export const updateStoreImage = createAsyncThunk(
  'profile/updateImage',
  async (imageUrl, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return imageUrl;
    } catch  {
      return rejectWithValue('Failed to upload image.');
    }
  }
);

// --- LOGOUT THUNK ---
// This acts as the SINGLE source of truth for the logout action
export const logoutUser = createAsyncThunk(
  'profile/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate server-side logout (invalidate token, etc.)
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch  {
      return rejectWithValue('Logout failed');
    }
  }
);

// --- DELETE ACCOUNT THUNK ---
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch  {
      return rejectWithValue('Failed to delete account.');
    }
  }
);

const initialState = {
  isEditing: false,
  activeTab: 'personal',
  isLoading: false,
  error: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggleEdit: (state) => {
      state.isEditing = !state.isEditing;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetProfileStatus: (state) => {
      state.isEditing = false;
      state.error = null;
      state.successMessage = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(updateProfileData.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfileData.fulfilled, (state) => {
        state.isLoading = false;
        state.isEditing = false;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateProfileData.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Update Image
    builder
      .addCase(updateStoreImage.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateStoreImage.fulfilled, (state) => { state.isLoading = false; state.successMessage = "Store image updated!"; })
      .addCase(updateStoreImage.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Logout Handling (Local loading state)
    builder
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; })
      .addCase(logoutUser.fulfilled, (state) => { 
        state.isLoading = false; 
        state.activeTab = 'personal'; 
      })
      .addCase(logoutUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Delete Account Handling
    builder
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAccount.fulfilled, (state) => { state.isLoading = false; })
      .addCase(deleteAccount.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export const { toggleEdit, setActiveTab, resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
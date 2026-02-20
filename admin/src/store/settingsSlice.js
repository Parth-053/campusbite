import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- ASYNC THUNKS ---

// Simulate fetching initial settings from backend
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); 
      return {
        commissions: {
          owner: { type: 'percentage', value: 7 }, // Platform cut from canteen
          user: { type: 'fixed', value: 5 }        // Convenience fee charged to student
        }
      };
    } catch {
      return rejectWithValue('Failed to fetch settings');
    }
  }
);

// Simulate updating settings on backend
export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (newSettings, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return newSettings;
    } catch  {
      return rejectWithValue('Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    commissions: {
      owner: { type: 'percentage', value: 7 },
      user: { type: 'fixed', value: 5 }
    },
    isLoading: false,
    isUpdating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = action.payload.commissions;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateSettings.pending, (state) => { state.isUpdating = true; })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.commissions = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  }
});

export default settingsSlice.reducer;
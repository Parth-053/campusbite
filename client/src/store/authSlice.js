import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
const MOCK_LOCATIONS = {
  states: ['Maharashtra', 'Delhi', 'Karnataka'],
  districts: {
    'Maharashtra': ['Pune', 'Mumbai'],
    'Delhi': ['New Delhi'],
    'Karnataka': ['Bangalore']
  },
  colleges: {
    'Pune': ['Pune Institute of Technology', 'COEP'],
    'Mumbai': ['Mumbai University'],
    'New Delhi': ['Delhi Tech'],
    'Bangalore': ['Bangalore Engineering College']
  },
  hostels: {
    'Pune Institute of Technology': ['Boys Hostel A', 'Girls Hostel B'],
    'COEP': ['Main Campus Hostel'],
    'Mumbai University': ['Sea View Hostel'],
    'Delhi Tech': ['North Block Hostel', 'South Block Hostel'],
    'Bangalore Engineering College': ['Tech Park Hostel']
  }
};

// --- ASYNC THUNKS (Simulating Backend) ---
export const fetchLocationData = createAsyncThunk('auth/fetchLocationData', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600)); 
    return MOCK_LOCATIONS;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch location data');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation
    if (credentials.email === 'student@test.com' && credentials.password === 'password') {
      const userData = { id: 'usr_1', name: 'Test Student', email: credentials.email, role: 'user', college: 'Pune Institute of Technology', hostel: 'Boys Hostel A' };
      
      // SAVE TO LOCAL STORAGE ON SUCCESS
      localStorage.setItem('campus_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Invalid email or password. Use student@test.com / password');
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const sendRegistrationOtp = createAsyncThunk('auth/sendOtp', async (userData, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`MOCK OTP for ${userData.email} is: 123456`);
    return userData; 
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to send OTP');
  }
});

export const verifyOtpAndRegister = createAsyncThunk('auth/verifyOtp', async ({ otp, userData }, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '123456') { 
      const newUser = { id: `usr_${Date.now()}`, ...userData, role: 'user' };
      
      // SAVE TO LOCAL STORAGE ON SUCCESS
      localStorage.setItem('campus_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error('Invalid OTP. Please enter 123456');
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Password reset link sent to your email!';
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to process request');
  }
});
export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (updatedData, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    
    // Merge new data with existing user data in local storage
    const savedUser = JSON.parse(localStorage.getItem('campus_user')) || {};
    const newUser = { ...savedUser, ...updatedData };
    localStorage.setItem('campus_user', JSON.stringify(newUser));
    
    return newUser;
  } catch  {
    return rejectWithValue('Failed to update profile');
  }
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    localStorage.removeItem('campus_user');
    return null;
  } catch {
    return rejectWithValue('Failed to delete account');
  }
});

// --- INITIAL STATE ---
// Check if user exists in local storage when the app first boots up
const savedUser = localStorage.getItem('campus_user');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null, // Load from storage if it exists
  tempUserData: null,       
  locationData: null,       
  isLoading: false,
  error: null,
};

// --- SLICE ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      // CLEAR LOCAL STORAGE ON LOGOUT
      localStorage.removeItem('campus_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Location Data
    builder.addCase(fetchLocationData.fulfilled, (state, action) => { state.locationData = action.payload; });

    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Send OTP 
    builder
      .addCase(sendRegistrationOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendRegistrationOtp.fulfilled, (state, action) => { state.isLoading = false; state.tempUserData = action.payload; })
      .addCase(sendRegistrationOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Verify OTP
    builder
      .addCase(verifyOtpAndRegister.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.user = action.payload; 
        state.tempUserData = null;   
      })
      .addCase(verifyOtpAndRegister.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
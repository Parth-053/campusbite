import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK ASYNC THUNKS ---

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // MOCK VALIDATION
    if (credentials.email === 'owner@test.com' && credentials.password === 'password') {
      return { 
        id: 'own_001', 
        name: 'Test Owner', 
        email: credentials.email, 
        token: 'mock-jwt-token',
        isVerified: true,
        isApproved: true 
      };
    }
    return rejectWithValue('Invalid email or password');
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerOwner = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { email: formData.personal.email }; // Return email for OTP step
  } catch {
    // Fixed: Removed unused 'error' variable
    return rejectWithValue('Registration failed. Try again.');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ otp }, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '123456') return true; // Mock OTP
    return rejectWithValue('Invalid OTP');
  } catch {
    // Fixed: Removed unused 'error' variable
    return rejectWithValue('Verification failed');
  }
});

// --- MOCK LOCATION DATA ---
const MOCK_LOCATIONS = {
  states: [
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KA', name: 'Karnataka' },
    { id: 'DL', name: 'Delhi' },
    { id: 'UP', name: 'Uttar Pradesh' }
  ],
  districts: {
    'MH': [{ id: 'PN', name: 'Pune' }, { id: 'MB', name: 'Mumbai' }],
    'KA': [{ id: 'BL', name: 'Bangalore' }, { id: 'MY', name: 'Mysore' }],
    'DL': [{ id: 'ND', name: 'New Delhi' }, { id: 'SD', name: 'South Delhi' }],
    'UP': [{ id: 'LK', name: 'Lucknow' }, { id: 'KN', name: 'Kanpur' }]
  },
  colleges: {
    'PN': [{ id: 'col_1', name: 'Pune Institute of Computer Technology' }, { id: 'col_2', name: 'COEP Technological University' }],
    'MB': [{ id: 'col_3', name: 'IIT Bombay' }, { id: 'col_4', name: 'VJTI Mumbai' }],
    'BL': [{ id: 'col_5', name: 'RV College of Engineering' }, { id: 'col_6', name: 'BMS College' }]
  },
  hostels: {
    'col_1': [{ id: 'h1', name: 'Boys Hostel A' }, { id: 'h2', name: 'Girls Hostel B' }],
    'col_3': [{ id: 'h3', name: 'H1 - Main Hostel' }, { id: 'h4', name: 'H10 - New Hostel' }]
  }
};

const initialState = {
  user: localStorage.getItem('owner') ? JSON.parse(localStorage.getItem('owner')) : null,
  isAuthenticated: !!localStorage.getItem('owner'),
  isLoading: false,
  error: null,
  registrationStep: 1, // 1=Personal, 2=Canteen, 3=Bank, 4=OTP, 5=Approval
  tempEmail: null, // Stored during registration for OTP
  locationData: MOCK_LOCATIONS
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('owner');
    },
    resetAuthError: (state) => {
      state.error = null;
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem('owner', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerOwner.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tempEmail = action.payload.email;
        state.registrationStep = 4; // Move to OTP
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationStep = 5; // Move to Approval Pending
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, resetAuthError, setRegistrationStep } = authSlice.actions;
export default authSlice.reducer;
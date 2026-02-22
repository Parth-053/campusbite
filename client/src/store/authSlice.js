import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';

// Keeping your location mock for now until we build the Location API
const MOCK_LOCATIONS = {
  states: ['Gujarat', 'Maharashtra'],
  districts: { 'Gujarat': ['Ahmedabad', 'Surat'] },
  colleges: { 'Ahmedabad': ['L.D. College', 'Nirma University'] },
  hostels: { 'L.D. College': ['Boys Hostel A', 'Girls Hostel B'] }
};

export const fetchLocationData = createAsyncThunk('auth/fetchLocationData', async () => {
  return MOCK_LOCATIONS;
});

// 1. REGISTER CUSTOMER
export const registerCustomer = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    // A. Create user in Firebase Securely
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const token = await userCredential.user.getIdToken();

    // B. Save Customer details in MongoDB
    // We don't send the password to our backend! Only Firebase knows it.
    const { password, ...customerData } = formData; 
    
    const response = await api.post('/auth/customer/register', customerData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
  }
});

// 2. LOGIN CUSTOMER
export const loginCustomer = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    const response = await api.post('/auth/customer/login', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Invalid credentials');
  }
});

export const logoutCustomer = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('customer') ? JSON.parse(localStorage.getItem('customer')) : null,
    locationData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationData.fulfilled, (state, action) => { state.locationData = action.payload; })
      
      // Handle Register
      .addCase(registerCustomer.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('customer', JSON.stringify(action.payload));
      })
      .addCase(registerCustomer.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Handle Login
      .addCase(loginCustomer.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('customer', JSON.stringify(action.payload));
      })
      .addCase(loginCustomer.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Handle Logout
      .addCase(logoutCustomer.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('customer');
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
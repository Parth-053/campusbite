import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';

// 1. Send OTP
export const sendRegistrationOtp = createAsyncThunk('auth/sendOtp', async (formData, { rejectWithValue }) => {
  try {
    await api.post('/auth/customer/send-otp', { email: formData.email, name: formData.name });
    return formData; 
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to send OTP"); }
});

// 2. Verify & Register
export const verifyOtpAndRegister = createAsyncThunk('auth/verifyAndRegister', async ({ otp, userData }, { rejectWithValue }) => {
  try {
    await api.post('/auth/customer/verify-otp-only', { email: userData.email, otp });
    
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const token = await userCredential.user.getIdToken();

    const customerData = { ...userData };
    delete customerData.password; 
 
    const res = await api.post('/auth/customer/register', customerData, { 
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'Customer' } 
    });
    return res.data.data;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') return rejectWithValue("Email is already registered.");
    return rejectWithValue(err.response?.data?.message || err.message || "Registration failed");
  }
});

// 3. Login
export const loginCustomer = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    const res = await api.post('/auth/customer/login', {}, { 
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'Customer' } 
    });
    return res.data.data;
  } catch (err) {
    if (err.code === 'auth/invalid-credential') return rejectWithValue("Invalid email or password.");
    return rejectWithValue(err.response?.data?.message || err.message || "Login failed");
  }
});

// 4. Session Restore
export const fetchCustomerProfile = createAsyncThunk('auth/fetchProfile', async (token, { rejectWithValue }) => {
  try {
    const res = await api.get('/profiles/customer', {
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'Customer' }
    });
    
    return res.data.data;
  } catch  { 
    return rejectWithValue("Session expired"); 
  }
});

// 5. Forgot Password
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err) {
    return rejectWithValue(err.message || "Failed to send reset email");
  }
});

// 6. Logout
export const logoutCustomer = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return true;
  } catch  { return rejectWithValue("Logout failed"); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    tempUserData: null,
    isAuthenticated: false,
    isLoading: true, 
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    setAuthLoading: (state, action) => { state.isLoading = action.payload; },
    logoutLocal: (state) => { 
      state.user = null; 
      state.isAuthenticated = false; 
      state.isLoading = false; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRegistrationOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendRegistrationOtp.fulfilled, (state, action) => { state.isLoading = false; state.tempUserData = action.payload; })
      .addCase(sendRegistrationOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(verifyOtpAndRegister.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; state.tempUserData = null; })
      .addCase(verifyOtpAndRegister.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(loginCustomer.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginCustomer.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(loginCustomer.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(fetchCustomerProfile.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(fetchCustomerProfile.rejected, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; })
      
      .addCase(logoutCustomer.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; state.tempUserData = null; state.isLoading = false; });
  }
});

export const { clearAuthError, setAuthLoading, logoutLocal } = authSlice.actions;
export default authSlice.reducer;